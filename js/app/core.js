// Application Core & State Management
window.App = window.App || {};

// Configuração via Vite (.env)
const TrelloConfig = {
    apiKey: import.meta.env.VITE_TRELLO_API_KEY,
    appName: 'Trello KPI Dashboard',
    scope: 'read',
    expiration: 'never'
};

// Helper para prevenir crashes por localStorage corrompido
function safeJSONParse(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`localStorage corrompido para ${key}, usando valor padrão`);
        return defaultValue;
    }
}

// Validação de webhooks - apenas Make e Zapier
function isValidWebhookUrl(url) {
    if (!url || url.trim() === '') return true; // Permite vazio (webhook opcional)

    try {
        const parsed = new URL(url);

        // Whitelist de domínios permitidos
        const allowedDomains = [
            'hook.make.com',
            'hooks.zapier.com'
        ];

        // Verifica se o hostname é ou termina com um dos domínios permitidos
        const isAllowed = allowedDomains.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
        );

        // Deve ser HTTPS e domínio permitido
        return isAllowed && parsed.protocol === 'https:';
    } catch {
        return false; // URL inválido
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
    userRole: localStorage.getItem('trello_user_role') || null, // Guardar role no storage
    funnelConfig: safeJSONParse('trello_funnel_config', null),
    hiddenFunnelLists: safeJSONParse('trello_hidden_funnel_lists', []),
    timeTrackingLists: safeJSONParse('trello_time_tracking_lists', { left: null, right: null }),
    viewMode: 'dashboard' // 'dashboard' or 'graphs'
};

App.init = function () {
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
        const token = hash.split('token=')[1].split('&')[0];
        if (token) {
            this.state.token = token;
            localStorage.setItem('trello_token', token);
            // Limpar hash de forma segura sem deixar no histórico
            window.history.replaceState(null, '', window.location.pathname);
        }
    }

    if (this.state.token) {
        // Se já temos token, verificamos se temos role
        if (!this.state.userRole) {
            this.render(); // Vai renderizar o seletor de role
        } else if (this.state.boardId) {
            // Se já temos boardId guardado, tentamos conectar direto
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

    // NOVA LÓGICA: Se tem token mas não tem role, mostra seleção de ROLE
    if (this.state.token && !this.state.userRole) {
        app.innerHTML = UI.renderRoleSelectorScreen(); // Novo ecrã a criar
        return;
    }

    if (!this.state.boardId || (this.state.availableBoards && this.state.availableBoards.length > 0 && !this.state.kpis)) {
        app.innerHTML = UI.renderConfig(this.state); // Renderiza selector de boards
        this.attachBoardEvents();
        return;
    }

    if (this.state.kpis) {
        if (this.state.viewMode === 'graphs') {
            app.innerHTML = UI.renderGraphsDashboard(this.state);
        } else {
            app.innerHTML = UI.renderDashboard(this.state);
        }
        this.attachDashboardEvents();
        this.attachDynamicEvents();
    } else {
        app.innerHTML = UI.renderConfig(this.state);
        if (!this.state.token) this.attachLoginEvents();
        else this.attachBoardEvents();
    }
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

    // 3. Time Tracking Selects
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
    const loginHandler = () => {
        if (!this.state.apiKey) {
            alert('Erro: API Key não encontrada no .env!');
            return;
        }
        const returnUrl = window.location.href;
        const authUrl = `https://trello.com/1/authorize?expiration=${TrelloConfig.expiration}&name=${encodeURIComponent(TrelloConfig.appName)}&scope=${TrelloConfig.scope}&response_type=token&key=${this.state.apiKey}&return_url=${encodeURIComponent(returnUrl)}`;
        window.location.href = authUrl;
    };

    const loginBtn = document.getElementById('loginTrelloBtn');
    if (loginBtn) loginBtn.addEventListener('click', loginHandler);

    // Landing Page Buttons
    const heroBtn = document.getElementById('heroStartBtn');
    if (heroBtn) heroBtn.addEventListener('click', loginHandler);

    const navBtn = document.getElementById('navLoginBtn');
    if (navBtn) navBtn.addEventListener('click', loginHandler);

    const ctaBtn = document.getElementById('ctaStartBtn');
    if (ctaBtn) ctaBtn.addEventListener('click', loginHandler);

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

            // Persistir configuração
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
            // AGORA JA SABEMOS O ROLE, ENTRA DIRETO
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

            // Validar webhook URL antes de guardar
            if (newUrl && !isValidWebhookUrl(newUrl)) {
                alert('❌ URL de webhook inválido!\n\nApenas são permitidos webhooks de:\n• Make.com (https://hook.make.com/...)\n• Zapier (https://hooks.zapier.com/...)');
                return;
            }

            this.state.webhookUrl = newUrl;
            localStorage.setItem('trello_webhook_url', newUrl);

            // Feedback Visual
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

    // 2. Date Pickers (COM VALIDAÇÃO)
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const clearDates = document.getElementById('clearDates');

    let dateChangeTimeout = null;

    // Helper: Validar datas
    const validateDates = (start, end) => {
        if (!start || !end) return { valid: true };

        const startD = new Date(start);
        const endD = new Date(end);

        if (startD > endD) {
            return {
                valid: false,
                message: '⚠️ A data inicial não pode ser depois da data final!'
            };
        }

        const diffDays = (endD - startD) / (1000 * 60 * 60 * 24);
        if (diffDays > 365) {
            return {
                valid: false,
                message: '⚠️ O período não pode ser superior a 1 ano!'
            };
        }

        return { valid: true };
    };

    // Helper: Recarregar com debounce e feedback visual
    const reloadWithDebounce = () => {
        if (dateChangeTimeout) {
            clearTimeout(dateChangeTimeout);
        }

        // Feedback visual durante loading
        if (startDate) startDate.classList.add('opacity-50', 'cursor-wait');
        if (endDate) endDate.classList.add('opacity-50', 'cursor-wait');

        // Debounce de 500ms
        dateChangeTimeout = setTimeout(() => {
            this.conectarTrello().finally(() => {
                if (startDate) startDate.classList.remove('opacity-50', 'cursor-wait');
                if (endDate) endDate.classList.remove('opacity-50', 'cursor-wait');
            });
        }, 500);
    };

    if (startDate) {
        startDate.addEventListener('change', (e) => {
            const newStart = e.target.value;
            const validation = validateDates(newStart, this.state.endDate);

            if (!validation.valid) {
                alert(validation.message);
                startDate.value = this.state.startDate; // Reverter
                return;
            }

            this.state.startDate = newStart;
            reloadWithDebounce();
        });
    }

    if (endDate) {
        endDate.addEventListener('change', (e) => {
            const newEnd = e.target.value;
            const validation = validateDates(this.state.startDate, newEnd);

            if (!validation.valid) {
                alert(validation.message);
                endDate.value = this.state.endDate; // Reverter
                return;
            }

            this.state.endDate = newEnd;
            reloadWithDebounce();
        });
    }

    if (clearDates) {
        clearDates.addEventListener('click', () => {
            this.state.startDate = '';
            this.state.endDate = '';
            if (startDate) startDate.value = '';
            if (endDate) endDate.value = '';
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
    this.state.userRole = role;
    localStorage.setItem('trello_user_role', role);
    this.listarBoards(); // Agora que temos role, vamos buscar os boards
};

// Função legacy para compatibilidade, caso algum modal antigo chame
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
