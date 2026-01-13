// Application Core & State Management
window.App = window.App || {};

// Configuração via Vite (.env)
const TrelloConfig = {
    apiKey: import.meta.env.VITE_TRELLO_API_KEY, // Agora carrega do .env (seguro)
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
    availableBoards: [] // Para o seletor de boards
};

App.init = function () {
    console.log('App initialized with API Key:', this.state.apiKey ? 'PRESENT' : 'MISSING');

    // 1. Verificar se voltamos do Trello com Token na URL
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
        const token = hash.split('token=')[1].split('&')[0];
        if (token) {
            this.state.token = token;
            localStorage.setItem('trello_token', token);
            window.location.hash = ''; // Limpar URL
        }
    }

    // 2. Decidir o que mostrar
    if (this.state.token) {
        // SEMPRE mostrar a lista de boards para o utilizador escolher
        // (Mesmo que tenha um boardId guardado, vamos listar para ele poder trocar ou confirmar)
        this.listarBoards();
    } else {
        // Nao temos token, mostrar login
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
        app.innerHTML = UI.renderConfig(this.state); // Vai mostrar spinner
        return;
    }

    if (!this.state.token) {
        // Login Screen
        app.innerHTML = UI.renderConfig(this.state);
        this.attachLoginEvents();
        return;
    }

    if (!this.state.boardId || (this.state.availableBoards && this.state.availableBoards.length > 0 && !this.state.kpis)) {
        // Board Selection Screen
        app.innerHTML = UI.renderConfig(this.state); // Vai mostrar seletor
        this.attachBoardEvents();
        return;
    }

    // Dashboard
    if (this.state.kpis) {
        app.innerHTML = UI.renderDashboard(this.state);
        this.attachDashboardEvents();
    } else {
        // Fallback
        app.innerHTML = UI.renderConfig(this.state);
        if (!this.state.token) this.attachLoginEvents();
        else this.attachBoardEvents();
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
};

// App.init() will be called in main.js after all modules are loaded
