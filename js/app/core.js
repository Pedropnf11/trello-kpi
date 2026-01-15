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
    userRole: localStorage.getItem('trello_user_role') || null, // Guardar role no storage
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
        app.innerHTML = UI.renderConfig(this.state);
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
    if (configBtn) configBtn.addEventListener('click', () => this.logout());

    const memberFilter = document.getElementById('memberFilter');
    if (memberFilter) {
        memberFilter.addEventListener('change', (e) => {
            this.state.selectedMemberId = e.target.value;
            this.render();
        });
    }

    // 2. Date Pickers
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const clearDates = document.getElementById('clearDates');

    if (startDate) {
        startDate.addEventListener('change', (e) => {
            this.state.startDate = e.target.value;
            this.conectarTrello(); // Recarregar dados com novas datas
        });
    }

    if (endDate) {
        endDate.addEventListener('change', (e) => {
            this.state.endDate = e.target.value;
            this.conectarTrello(); // Recarregar dados com novas datas
        });
    }

    if (clearDates) {
        clearDates.addEventListener('click', () => {
            this.state.startDate = '';
            this.state.endDate = '';
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

    // 4. Chatbot
    const toggleChatBtn = document.getElementById('toggleChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatModal = document.getElementById('chatModal');

    // Restaurar estado do chat
    if (this.state.chatOpen && chatModal) {
        chatModal.classList.remove('hidden');
        this.renderChatHistory();
    }

    if (toggleChatBtn) {
        toggleChatBtn.addEventListener('click', () => {
            this.state.chatOpen = !this.state.chatOpen;
            this.render(); // Re-render para mostrar/esconder (ou podia só fazer toggle class)
            // Optamos por re-render para manter consistência, mas neste caso específico:
            // Se já renderizámos, basta toggle class para ser mais fluido
            // Mas o renderChatHistory precisa de correr.
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            this.state.chatOpen = false;
            if (chatModal) chatModal.classList.add('hidden');
        });
    }

    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');

    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            this.handleChatMessage(text);
            chatInput.value = '';
        }
    };

    if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
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
