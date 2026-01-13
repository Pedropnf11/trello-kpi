// Application Core & State Management
window.App = window.App || {};

// Configuração via Vite (.env)
const TrelloConfig = {
    apiKey: import.meta.env.VITE_TRELLO_API_KEY,
    appName: 'Trello KPI Dashboard',
    scope: 'read',
    expiration: 'never'
};

App.state = {
    apiKey: TrelloConfig.apiKey,
    token: localStorage.getItem('trello_token') || '',
    boardId: localStorage.getItem('trello_board_id') || '',
    webhookUrl: localStorage.getItem('trello_webhook_url') || 'https://hook.eu1.make.com/d7bsp420w5lt67xg8cq2ha1hege2rn01',
    groqApiKey: localStorage.getItem('trello_groq_key') || '',
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
    userRole: 'manager',
    funnelConfig: JSON.parse(localStorage.getItem('trello_funnel_config') || 'null'),
    hiddenFunnelLists: JSON.parse(localStorage.getItem('trello_hidden_funnel_lists') || '[]'),
    timeTrackingLists: JSON.parse(localStorage.getItem('trello_time_tracking_lists') || '{"left": null, "right": null}')
};

App.init = function () {
    console.log('App initialized with API Key:', this.state.apiKey ? 'PRESENT' : 'MISSING');

    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
        const token = hash.split('token=')[1].split('&')[0];
        if (token) {
            this.state.token = token;
            localStorage.setItem('trello_token', token);
            window.location.hash = '';
        }
    }

    if (this.state.token) {
        this.listarBoards();
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
        app.innerHTML = UI.renderConfig(this.state);
        this.attachLoginEvents();
        return;
    }

    if (!this.state.boardId || (this.state.availableBoards && this.state.availableBoards.length > 0 && !this.state.kpis)) {
        app.innerHTML = UI.renderConfig(this.state);
        this.attachBoardEvents();
        return;
    }

    if (this.state.kpis) {
        app.innerHTML = UI.renderDashboard(this.state);
        this.attachDashboardEvents();
        this.attachDynamicEvents(); // Attach new events
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
    const loginBtn = document.getElementById('loginTrelloBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (!this.state.apiKey) {
                alert('Erro: API Key não encontrada no .env!');
                return;
            }
            const returnUrl = window.location.href;
            const authUrl = `https://trello.com/1/authorize?expiration=${TrelloConfig.expiration}&name=${encodeURIComponent(TrelloConfig.appName)}&scope=${TrelloConfig.scope}&response_type=token&key=${this.state.apiKey}&return_url=${encodeURIComponent(returnUrl)}`;
            window.location.href = authUrl;
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

        if (apiKey && token && boardId) {
            this.state.apiKey = apiKey;
            this.state.token = token;
            this.state.boardId = boardId;
            this.conectarTrello();
        }
    });
};

App.attachBoardEvents = function () {
    const boardCards = document.querySelectorAll('.board-card');
    boardCards.forEach(card => {
        card.addEventListener('click', () => {
            const boardId = card.getAttribute('data-id');
            const boardName = card.querySelector('h3')?.innerText || 'Quadro';

            // Render and append modal
            const modalHtml = UI.renderRoleSelectionModal(boardId, boardName);
            document.body.insertAdjacentHTML('beforeend', modalHtml);
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
    const bind = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    bind('atualizarBtn', 'click', () => this.conectarTrello());
    bind('exportarBtn', 'click', () => this.exportarExcel());
    bind('exportarPdfBtn', 'click', () => window.exportarPDFMelhorado ? window.exportarPDFMelhorado() : this.exportarPDF());
    bind('importarBtn', 'click', () => this.importarCSV());
    bind('csvInput', 'change', (e) => this.processarImportacao(e.target.files[0]));
    bind('enviarWebhookBtn', 'click', () => this.enviarWebhook());
    bind('configBtn', 'click', () => this.logout());

    bind('memberFilter', 'change', (e) => {
        this.state.selectedMemberId = e.target.value;
        this.render();
    });

    bind('startDate', 'change', (e) => {
        this.state.startDate = e.target.value;
        this.conectarTrello();
    });

    bind('endDate', 'change', (e) => {
        this.state.endDate = e.target.value;
        this.conectarTrello();
    });

    bind('clearDates', 'click', () => {
        this.state.startDate = '';
        this.state.endDate = '';
        this.conectarTrello();
    });

    // Chat Events
    bind('toggleChatBtn', 'click', () => this.toggleChat());
    bind('closeChatBtn', 'click', () => this.toggleChat());
    bind('sendChatBtn', 'click', () => this.enviarMensagemChat());
    bind('chatInput', 'keypress', (e) => {
        if (e.key === 'Enter') this.enviarMensagemChat();
    });

    // Funnel Config Events (Mantido apenas por compatibilidade ou acesso rápido)
    bind('configFunnelBtn', 'click', () => {
        if (!this.state.rawData || !this.state.rawData.listas) return;

        const modalHtml = UI.renderFunnelConfigModal(this.state.rawData.listas, this.state.funnelConfig);
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const saveBtn = document.getElementById('saveFunnelConfigBtn');
        const resetBtn = document.getElementById('resetFunnelConfigBtn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const config = {};
                ['leads', 'contactado', 'proposta', 'fechado'].forEach(id => {
                    const select = document.getElementById('funnel_select_' + id);
                    if (select) {
                        config[id] = Array.from(select.selectedOptions).map(opt => opt.value);
                    }
                });

                this.state.funnelConfig = config;
                localStorage.setItem('trello_funnel_config', JSON.stringify(config));

                document.getElementById('funnelConfigModal').remove();
                this.conectarTrello();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.state.funnelConfig = null;
                localStorage.removeItem('trello_funnel_config');

                document.getElementById('funnelConfigModal').remove();
                this.conectarTrello();
            });
        }
    });

};

App.confirmRole = function (boardId, role) {
    this.state.userRole = role;
    const modal = document.getElementById('roleSelectionModal');
    if (modal) modal.remove();
    this.selecionarBoard(boardId);
};
