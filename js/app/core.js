window.App = window.App || {};

const TrelloConfig = {
    apiKey: import.meta.env.VITE_TRELLO_API_KEY,
    appName: 'KPI Master Dashboard',
    scope: 'read,write',
    expiration: '30days'
};

function safeJSONParse(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`localStorage corrompido para ${key}, usando valor padrão`);
        return defaultValue;
    }
}

function isValidWebhookUrl(url) {
    if (!url || url.trim() === '') return true;

    try {
        const parsed = new URL(url);

        const allowedDomains = [
            'hook.make.com',
            'hooks.zapier.com'
        ];

        const isAllowed = allowedDomains.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
        );

        return isAllowed && parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

App.state = {
    apiKey: TrelloConfig.apiKey,
    token: localStorage.getItem('trello_token') || '',
    boardId: localStorage.getItem('trello_board_id') || '',
    webhookUrl: localStorage.getItem('trello_webhook_url') || '',
    showConfig: true,
    loading: false,
    kpis: null,
    rawData: null,
    selectedMemberId: '',
    startDate: '',
    endDate: '',
    error: '',
    chatOpen: false,
    chatHistory: [],
    availableBoards: [],
    userRole: localStorage.getItem('trello_user_role') || null,
    funnelConfig: safeJSONParse('trello_funnel_config', null),
    hiddenFunnelLists: safeJSONParse('trello_hidden_funnel_lists', []),
    timeTrackingLists: safeJSONParse('trello_time_tracking_lists', { left: null, right: null }),
    viewMode: 'dashboard'
};

App.init = function () {
    const hash = window.location.hash;
    if (hash) {
        if (hash.includes('token=')) {
            const token = hash.split('token=')[1].split('&')[0];
            if (token) {
                this.state.token = token;
                localStorage.setItem('trello_token', token);
            }
        }
        if (hash.includes('board=')) {
            const boardId = hash.split('board=')[1].split('&')[0];
            if (boardId) {
                this.state.boardId = boardId;
                localStorage.setItem('trello_board_id', boardId);
            }
        }
        if (hash.includes('role=')) {
            const urlRole = hash.split('role=')[1].split('&')[0];
            if (urlRole) {
                let mappedRole = urlRole;
                if (urlRole === 'gestor') mappedRole = 'manager';
                if (urlRole === 'vendedor') mappedRole = 'sales';
                this.state.userRole = mappedRole;
                localStorage.setItem('trello_user_role', mappedRole);
            }
        }
        window.history.replaceState(null, '', window.location.pathname);
    }

    if (this.state.token) {
        if (!this.state.userRole) {
            this.render();
        } else if (this.state.boardId) {
            this.selecionarBoard(this.state.boardId);
        } else {
            this.listarBoards();
        }
    } else {
        this.render();
    }
};

App.updateState = function (newState) {
    this.state = { ...this.state, ...newState };
    this.render();
};

App.render = function () {
    const app = document.getElementById('app');

    if (this.state.loading) {
        app.innerHTML = UI.renderConfig(this.state);
        return;
    }

    if (!this.state.token) {
        app.innerHTML = UI.renderLandingPage(this.state);
        this.attachLoginEvents();
        return;
    }

    if (this.state.token && !this.state.userRole) {
        app.innerHTML = UI.renderRoleSelectorScreen();
        return;
    }

    if (!this.state.boardId || (!this.state.kpis && !this.state.loading)) {
        if (!this.state.boardId) {
            app.innerHTML = UI.renderConfig(this.state);
            this.attachBoardEvents();
            return;
        }
    }

    if (this.state.kpis) {
        if (this.state.viewMode === 'graphs') {
            app.innerHTML = UI.renderGraphsDashboard(this.state);
        } else {
            app.innerHTML = UI.renderDashboard(this.state);
        }
        this.attachDashboardEvents();
        this.attachDynamicEvents();
        this.checkFeedbackFirstTimeOnboarding();
        return;
    }

    app.innerHTML = UI.renderConfig(this.state);
    this.attachBoardEvents();
};

App.attachDynamicEvents = function () {
    // 1. Funnel List Removal (X buttons)
    document.querySelectorAll('.remove-funnel-list-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const listId = btn.dataset.id;
            if (listId) {
                this.state.hiddenFunnelLists.push(listId);
                localStorage.setItem('trello_hidden_funnel_lists', JSON.stringify(this.state.hiddenFunnelLists));
                this.render();
            }
        };
    });

    // 2. Reset Hidden Lists
    const resetHiddenBtn = document.getElementById('resetHiddenListsBtn');
    if (resetHiddenBtn) {
        resetHiddenBtn.onclick = () => {
            this.state.hiddenFunnelLists = [];
            localStorage.setItem('trello_hidden_funnel_lists', '[]');
            this.render();
        };
    }

    const leftSelect = document.getElementById('timeTrackingSelectLeft');
    const rightSelect = document.getElementById('timeTrackingSelectRight');

    if (leftSelect) {
        leftSelect.onchange = (e) => {
            this.state.timeTrackingLists.left = e.target.value;
            localStorage.setItem('trello_time_tracking_lists', JSON.stringify(this.state.timeTrackingLists));
            this.render();
        };
    }

    if (rightSelect) {
        rightSelect.onchange = (e) => {
            this.state.timeTrackingLists.right = e.target.value;
            localStorage.setItem('trello_time_tracking_lists', JSON.stringify(this.state.timeTrackingLists));
            this.render();
        };
    }

    // 4. Action Items Filters
    const filterBtns = document.querySelectorAll('.action-filter-btn');
    if (filterBtns.length > 0) {
        const updateActiveState = (selectedBtn) => {
            filterBtns.forEach(btn => {
                // Reset to base style (inactive)
                btn.className = 'action-filter-btn px-4 py-1 rounded-lg text-xs font-bold transition-all bg-white text-gray-500 hover:bg-gray-50 shadow-sm border border-gray-100';

                if (btn === selectedBtn) {
                    const type = btn.dataset.filter;
                    if (type === 'critical') btn.className = 'action-filter-btn px-4 py-1 rounded-lg text-xs font-bold transition-all bg-purple-600 text-white shadow-md transform scale-105';
                    else if (type === 'high') btn.className = 'action-filter-btn px-4 py-1 rounded-lg text-xs font-bold transition-all bg-red-600 text-white shadow-md transform scale-105';
                    else if (type === 'medium') btn.className = 'action-filter-btn px-4 py-1 rounded-lg text-xs font-bold transition-all bg-yellow-500 text-white shadow-md transform scale-105';
                    else btn.className = 'action-filter-btn px-4 py-1 rounded-lg text-xs font-bold transition-all bg-gray-800 text-white shadow-md transform scale-105';
                }
            });
        };

        // Init default state
        const allBtn = document.querySelector('.action-filter-btn[data-filter="all"]');
        if (allBtn) updateActiveState(allBtn);

        filterBtns.forEach(btn => {
            btn.onclick = () => {
                const filter = btn.dataset.filter;
                updateActiveState(btn);

                const items = document.querySelectorAll('.action-item');
                items.forEach(item => {
                    if (filter === 'all' || item.dataset.priority === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            };
        });
    }
};

App.attachLoginEvents = function () {
    if (UI.initLandingAnimations) UI.initLandingAnimations();

    const loginHandler = () => {
        if (!this.state.apiKey) {
            alert('Erro: API Key não encontrada no .env!');
            return;
        }
        const returnUrl = window.location.href;
        const authUrl = `https://trello.com/1/authorize?expiration=${TrelloConfig.expiration}&name=${encodeURIComponent(TrelloConfig.appName)}&scope=${TrelloConfig.scope}&response_type=token&key=${this.state.apiKey}&return_url=${encodeURIComponent(returnUrl)}`;
        window.location.href = authUrl;
    };

    // Auth screen button
    const loginBtn = document.getElementById('loginTrelloBtn');
    if (loginBtn) loginBtn.addEventListener('click', loginHandler);

    // Landing Page: hero button
    const heroBtn = document.getElementById('heroStartBtn');
    if (heroBtn) heroBtn.addEventListener('click', loginHandler);

    // Landing Page: navbar desktop button
    const navBtn = document.getElementById('navLoginBtn');
    if (navBtn) navBtn.addEventListener('click', loginHandler);

    // Landing Page: navbar mobile dropdown button
    const navBtnMob = document.getElementById('navLoginBtnMob');
    if (navBtnMob) navBtnMob.addEventListener('click', loginHandler);

    // Landing Page: CTA section button
    const ctaBtn = document.getElementById('ctaStartBtn');
    if (ctaBtn) ctaBtn.addEventListener('click', loginHandler);

    // Language Toggle (desktop)
    const langBtn = document.getElementById('lpLangToggleBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = UI._lpLang === 'pt' ? 'en' : 'pt';
            UI.applyLandingTranslation(newLang);
        });
    }

    // Language Toggle (mobile)
    const langBtnMob = document.getElementById('lpLangToggleBtnMob');
    if (langBtnMob) {
        langBtnMob.addEventListener('click', () => {
            const newLang = UI._lpLang === 'pt' ? 'en' : 'pt';
            UI.applyLandingTranslation(newLang);
        });
    }

    const manualBtn = document.getElementById('showManualConfig');
    if (manualBtn) {
        manualBtn.addEventListener('click', () => {
            const app = document.getElementById('app');
            app.innerHTML = UI.renderManualConfig(this.state);
            this.attachManualEvents();
        });
    }
};

App.attachManualEvents = function () {
    const bind = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    bind('backToLogin', 'click', () => this.render());

    bind('conectarManualBtn', 'click', () => {
        const apiKey = document.getElementById('apiKey').value;
        const token = document.getElementById('token').value;
        const boardId = document.getElementById('boardId').value;
        const webhookUrl = document.getElementById('webhookUrl').value;

        if (apiKey && token && boardId) {
            this.state.apiKey = apiKey;
            this.state.token = token;
            this.state.boardId = boardId;
            this.state.webhookUrl = webhookUrl;

            localStorage.setItem('trello_webhook_url', webhookUrl);

            this.conectarTrello();
        }
    });
};

App.attachBoardEvents = function () {
    const boardCards = document.querySelectorAll('.board-card');
    boardCards.forEach(card => {
        card.addEventListener('click', () => {
            const boardId = card.getAttribute('data-id');
            this.selecionarBoard(boardId);
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });
    }
};

App.attachDashboardEvents = function () {
    // 1. Sidebar - Logout e Filtros
    const configBtn = document.getElementById('configBtn');
    const logoutModal = document.getElementById('logoutModal');

    if (configBtn && logoutModal) {
        configBtn.addEventListener('click', () => {
            logoutModal.classList.remove('hidden');
        });
    }

    // Logout Modal Actions
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const changeBoardBtn = document.getElementById('changeBoardBtn');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => this.logout());
    }

    if (changeBoardBtn) {
        changeBoardBtn.addEventListener('click', () => {
            this.resetBoardAndRole();
        });
    }

    if (cancelLogoutBtn && logoutModal) {
        cancelLogoutBtn.addEventListener('click', () => {
            logoutModal.classList.add('hidden');
        });

        // Close on click outside
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.add('hidden');
            }
        });
    }

    // 1.0 Settings Modal
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const dashboardWebhookUrl = document.getElementById('dashboardWebhookUrl');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    if (saveSettingsBtn && dashboardWebhookUrl) {
        saveSettingsBtn.addEventListener('click', () => {
            const newUrl = dashboardWebhookUrl.value.trim();

            if (newUrl && !isValidWebhookUrl(newUrl)) {
                alert('❌ URL de webhook inválido!\n\nApenas são permitidos webhooks de:\n• Make.com (https://hook.make.com/...)\n• Zapier (https://hooks.zapier.com/...)');
                return;
            }

            this.state.webhookUrl = newUrl;
            localStorage.setItem('trello_webhook_url', newUrl);

            const originalText = saveSettingsBtn.innerHTML;
            saveSettingsBtn.innerHTML = '✔ Guardado!';
            saveSettingsBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            saveSettingsBtn.classList.add('bg-green-600', 'hover:bg-green-500');

            setTimeout(() => {
                saveSettingsBtn.innerHTML = originalText;
                saveSettingsBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
                saveSettingsBtn.classList.remove('bg-green-600', 'hover:bg-green-500');
                settingsModal.classList.add('hidden');
            }, 1000);
        });
    }

    // 1.1 Tutorial Modal
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const closeTutorialBtn = document.getElementById('closeTutorialBtn');

    if (tutorialBtn && tutorialModal) {
        tutorialBtn.addEventListener('click', () => {
            tutorialModal.classList.remove('hidden');
        });
    }

    if (closeTutorialBtn && tutorialModal) {
        closeTutorialBtn.addEventListener('click', () => {
            tutorialModal.classList.add('hidden');
        });
    }

    if (tutorialModal) {
        // Fecha se clicar fora do modal
        tutorialModal.addEventListener('click', (e) => {
            if (e.target === tutorialModal) {
                tutorialModal.classList.add('hidden');
            }
        });

        // Tabs Logic
        const tabs = tutorialModal.querySelectorAll('.tutorial-tab-btn');
        const contents = tutorialModal.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset styles
                tabs.forEach(t => {
                    t.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
                    t.classList.add('text-gray-400');
                });
                // Activate current
                tab.classList.remove('text-gray-400');
                tab.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');

                // Switch content
                const target = tab.dataset.tab;
                contents.forEach(content => {
                    if (content.id === `tab-content-${target}`) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 1.2 Docs Modal
    const docsBtn = document.getElementById('docsBtn');
    const docsModal = document.getElementById('docsModal');
    const closeDocsBtn = document.getElementById('closeDocsBtn');

    if (docsBtn && docsModal) {
        docsBtn.addEventListener('click', () => {
            docsModal.classList.remove('hidden');
        });
    }

    if (closeDocsBtn && docsModal) {
        closeDocsBtn.addEventListener('click', () => {
            docsModal.classList.add('hidden');
        });
    }

    if (docsModal) {
        // Tabs Logic
        const tabs = docsModal.querySelectorAll('.docs-tab-btn');
        const lists = docsModal.querySelectorAll('.docs-list-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset styles
                tabs.forEach(t => {
                    t.classList.remove('text-green-500', 'border-b-2', 'border-green-500');
                    t.classList.add('text-gray-400', 'border-transparent');
                });
                // Activate current
                tab.classList.remove('text-gray-400', 'border-transparent');
                tab.classList.add('text-green-500', 'border-b-2', 'border-green-500');

                // Switch list content
                const target = tab.dataset.tab;
                lists.forEach(list => {
                    if (list.id === `docs-list-${target}`) {
                        list.classList.remove('hidden');
                    } else {
                        list.classList.add('hidden');
                    }
                });
            });
        });

        // Fecha se clicar fora do modal
        docsModal.addEventListener('click', (e) => {
            if (e.target === docsModal) {
                docsModal.classList.add('hidden');
            }
        });
    }

    // Graph Dashboard Filter
    const activityPeriodFilter = document.getElementById('activityPeriodFilter');
    if (activityPeriodFilter) {
        activityPeriodFilter.addEventListener('change', (e) => {
            const days = e.target.value;
            const container = document.getElementById('teamPerformanceChartContainer');
            if (container && this.state.rawData) {
                container.innerHTML = UI.renderTeamPerformanceChart(this.state.kpis?.geral, this.state.rawData, days);
            }
        });
    }

    const memberFilter = document.getElementById('memberFilter');
    if (memberFilter) {
        memberFilter.addEventListener('change', (e) => {
            this.state.selectedMemberId = e.target.value;
            this.render();
        });
    }

    // 2. Date Pickers (Flatpickr Ultra-Premium Dark Theme)
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const clearDates = document.getElementById('clearDates');

    let fpStart = null;
    let fpEnd = null;

    let dateChangeTimeout = null;

    const formatDateLocal = (dateObj) => {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Helper: Validar datas
    const validateDates = (start, end) => {
        if (!start || !end) return { valid: true };

        const startD = new Date(start);
        const endD = new Date(end);

        if (startD > endD) {
            return {
                valid: false,
                message: 'A data inicial não pode ser posterior à data final.'
            };
        }

        const diffDays = (endD - startD) / (1000 * 60 * 60 * 24);
        if (diffDays > 365) {
            return {
                valid: false,
                message: 'O período selecionado não pode exceder 1 ano.'
            };
        }

        return { valid: true };
    };

    // Helper: Recarregar com debounce
    const reloadWithDebounce = () => {
        if (dateChangeTimeout) {
            clearTimeout(dateChangeTimeout);
        }

        dateChangeTimeout = setTimeout(() => {
            this.conectarTrello();
        }, 400);
    };

    const inputClasses = "w-full bg-[#0d1117] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-[12px] text-gray-200 focus:outline-none focus:border-blue-500/50 cursor-pointer font-semibold transition-all hover:bg-[#111723] hover:border-white/[0.15]";
    const localePt = (window.flatpickr && window.flatpickr.l10ns && window.flatpickr.l10ns.pt) ? window.flatpickr.l10ns.pt : ((window.flatpickrPt && window.flatpickrPt.pt) ? window.flatpickrPt.pt : 'pt');

    if (startDate && window.flatpickr) {
        if (startDate._flatpickr) startDate._flatpickr.destroy();
        fpStart = window.flatpickr(startDate, {
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            altInputClass: inputClasses,
            locale: localePt,
            defaultDate: this.state.startDate || null,
            onChange: (selectedDates, dateStr) => {
                const validation = validateDates(dateStr, this.state.endDate);
                if (!validation.valid) {
                    alert(validation.message);
                    if (fpStart) fpStart.setDate(this.state.startDate || '', false);
                    return;
                }
                this.state.startDate = dateStr;
                reloadWithDebounce();
            }
        });
    }

    if (endDate && window.flatpickr) {
        if (endDate._flatpickr) endDate._flatpickr.destroy();
        fpEnd = window.flatpickr(endDate, {
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            altInputClass: inputClasses,
            locale: localePt,
            defaultDate: this.state.endDate || null,
            onChange: (selectedDates, dateStr) => {
                const validation = validateDates(this.state.startDate, dateStr);
                if (!validation.valid) {
                    alert(validation.message);
                    if (fpEnd) fpEnd.setDate(this.state.endDate || '', false);
                    return;
                }
                this.state.endDate = dateStr;
                reloadWithDebounce();
            }
        });
    }

    // Handlers para os botões de presets (7D, 30D, Mês)
    document.querySelectorAll('.date-preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preset = btn.getAttribute('data-preset');
            const now = new Date();
            const todayStr = formatDateLocal(now);

            let startStr = '';
            if (preset === '7d') {
                const d = new Date(now);
                d.setDate(d.getDate() - 7);
                startStr = formatDateLocal(d);
            } else if (preset === '30d') {
                const d = new Date(now);
                d.setDate(d.getDate() - 30);
                startStr = formatDateLocal(d);
            } else if (preset === 'month') {
                startStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            }

            this.state.startDate = startStr;
            this.state.endDate = todayStr;

            if (fpStart) fpStart.setDate(startStr, false);
            if (fpEnd) fpEnd.setDate(todayStr, false);

            this.conectarTrello();
        });
    });

    if (clearDates) {
        clearDates.addEventListener('click', () => {
            this.state.startDate = '';
            this.state.endDate = '';
            if (fpStart) fpStart.clear();
            if (fpEnd) fpEnd.clear();
            this.conectarTrello();
        });
    }

    // 3. Header Actions
    const atualizarBtn = document.getElementById('atualizarBtn');
    if (atualizarBtn) {
        atualizarBtn.addEventListener('click', () => {
            this.conectarTrello();
        });
    }

    const importLeadBtn = document.getElementById('importLeadBtn');
    if (importLeadBtn && this.openLeadImportModal) {
        importLeadBtn.addEventListener('click', () => this.openLeadImportModal());
    }

    const exportarBtn = document.getElementById('exportarBtn');
    if (exportarBtn && this.exportarCSV) {
        exportarBtn.addEventListener('click', () => this.exportarCSV());
    }

    const exportarPdfBtn = document.getElementById('exportarPdfBtn');
    if (exportarPdfBtn && this.exportarPDF) {
        exportarPdfBtn.addEventListener('click', () => this.exportarPDF());
    }

    const enviarWebhookBtn = document.getElementById('enviarWebhookBtn');
    if (enviarWebhookBtn && this.enviarWebhook) {
        enviarWebhookBtn.addEventListener('click', () => this.enviarWebhook());
    }

    // 4. Navigation (Graphs)
    const goToGraphsBtn = document.getElementById('goToGraphsBtn');
    if (goToGraphsBtn) {
        goToGraphsBtn.addEventListener('click', () => {
            this.state.viewMode = 'graphs';
            this.render();
        });
    }

    const backToDashBtn = document.getElementById('backToDashBtn');
    if (backToDashBtn) {
        backToDashBtn.addEventListener('click', () => {
            this.state.viewMode = 'dashboard';
            this.render();
        });
    }
};

App.setRole = function (role) {
    this.state.boardId = '';
    this.state.kpis = null;
    this.state.availableBoards = [];
    localStorage.removeItem('trello_board_id');

    if (!role) {
        this.state.userRole = null;
        localStorage.removeItem('trello_user_role');
        this.render();
        return;
    }

    this.state.userRole = role;
    localStorage.setItem('trello_user_role', role);
    this.listarBoards();
};

App.confirmRole = function (boardId, role) {
    this.selecionarBoard(boardId);
};

App.resetBoardAndRole = function () {
    localStorage.removeItem('trello_board_id');
    localStorage.removeItem('trello_user_role');
    this.state.boardId = '';
    this.state.userRole = null;
    this.state.kpis = null;
    this.render();
};

App.checkFeedbackFirstTimeOnboarding = function () {
    const currentRole = this.state.userRole || 'manager';
    const storageKey = 'kpi_feedback_onboarding_seen_' + currentRole;

    if (localStorage.getItem(storageKey)) return;

    setTimeout(() => {
        if (document.getElementById('firstTimeFeedbackOverlay')) return;

        const lang = UI._lpLang || 'pt';
        const isPt = lang.startsWith('pt');

        const titleText = isPt ? 'Powerup em desenvolvimento!' : 'Powerup under active development!';
        const subTitleText = isPt ? 'Queremos saber a tua opinião!' : 'We want your feedback!';
        const descText = isPt
            ? 'Estamos constantemente a evoluir o KPI Master. A tua opinião e sugestões são fundamentais para nós!'
            : 'We are constantly improving KPI Master. Your feedback and suggestions are essential to us!';
        const btnText = isPt ? 'Entendido!' : 'Got it!';
        const pointerTitle = isPt ? 'Sugestões de Melhoria' : 'Suggestions to Improve';
        const pointerDesc = isPt ? 'Clica no botão "Enviar Feedback" no menu para nos enviares as tuas sugestões para melhorar a app!' : 'Click "Send Feedback" in the menu to share your suggestions to improve the app!';

        const overlay = document.createElement('div');
        overlay.id = 'firstTimeFeedbackOverlay';
        overlay.className = 'fixed inset-0 z-[300] flex flex-col justify-between p-6 bg-black/75 backdrop-blur-sm transition-all duration-300';
        overlay.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto">
                <div class="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 animate-pulse">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">${titleText}</h2>
                <p class="text-lg md:text-xl font-bold text-blue-400 mb-4">${subTitleText}</p>
                <p class="text-xs md:text-sm text-gray-300 mb-8 max-w-md leading-relaxed">${descText}</p>
                
                <button id="closeFeedbackOverlayBtn" class="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
                    ${btnText}
                </button>
            </div>

            <!-- Pointer Card positioned next to the 260px sidebar pointing LEFT at Send Feedback button -->
            <div class="fixed bottom-6 left-4 md:left-[270px] md:bottom-28 z-[310] flex items-center gap-3 bg-[#0b0f19] border border-blue-500/50 p-4 rounded-2xl shadow-2xl max-w-sm border-l-4 border-l-blue-500 animate-bounce">
                <svg class="w-7 h-7 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <div>
                    <div class="text-xs font-black text-white mb-0.5">${pointerTitle}</div>
                    <div class="text-[11px] text-gray-300 leading-snug">${pointerDesc}</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('closeFeedbackOverlayBtn').onclick = function () {
            localStorage.setItem(storageKey, 'true');
            overlay.remove();
        };
    }, 100);
};

// Enviar Feedback para o Webhook do Make.com (JSON auto-parsed pelo Make)
App.sendFeedback = async function (inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const feedbackText = input.value.trim();
    if (!feedbackText) return;

    const popup = document.getElementById('bugReportPopup');
    const submitBtn = popup ? popup.querySelector('button.bg-blue-600') : null;
    const originalText = submitBtn ? submitBtn.innerText : 'Enviar Feedback';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'A enviar...';
        submitBtn.classList.add('opacity-70', 'cursor-wait');
    }

    try {
        const payload = {
            text: feedbackText
        };

        await fetch('https://hook.eu1.make.com/5mla3rqp2s362eqa6tspuqykucwycu43', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (submitBtn) {
            submitBtn.innerText = '✓ Enviado!';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            submitBtn.classList.add('bg-emerald-600');
        }

        setTimeout(() => {
            input.value = '';
            if (popup) popup.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                submitBtn.classList.remove('opacity-70', 'cursor-wait', 'bg-emerald-600');
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
            }
        }, 1200);
    } catch (err) {
        console.error('Erro ao enviar feedback:', err);
        alert('Ocorreu um erro ao enviar o feedback. Por favor tenta novamente.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            submitBtn.classList.remove('opacity-70', 'cursor-wait');
        }
    }
};
