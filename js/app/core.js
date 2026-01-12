// Application Core & State Management
window.App = window.App || {};

App.state = {
    apiKey: localStorage.getItem('trello_api_key') || '',
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
    chatHistory: []
};

App.init = function () {
    this.render();
};

App.updateState = function (newState) {
    this.state = { ...this.state, ...newState };
    this.render();
};

App.render = function () {
    const app = document.getElementById('app');

    if (this.state.showConfig || !this.state.kpis) {
        app.innerHTML = UI.renderConfig(this.state);
    } else {
        app.innerHTML = UI.renderDashboard(this.state);
    }

    this.attachEvents();
};

App.attachEvents = function () {
    // Event delegation or direct binding
    const bind = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    bind('conectarBtn', 'click', () => this.conectarTrello());
    bind('atualizarBtn', 'click', () => this.conectarTrello());
    bind('exportarBtn', 'click', () => this.exportarExcel());
    // Note: exportarPdfBtn now uses the global exportarPDFMelhorado from pdf-export.js as per original attached event
    bind('exportarPdfBtn', 'click', () => window.exportarPDFMelhorado ? window.exportarPDFMelhorado() : this.exportarPDF());
    bind('importarBtn', 'click', () => this.importarCSV());
    bind('csvInput', 'change', (e) => this.processarImportacao(e.target.files[0]));
    bind('enviarWebhookBtn', 'click', () => this.enviarWebhook());

    bind('configBtn', 'click', () => {
        this.updateState({ showConfig: true });
    });

    bind('memberFilter', 'change', (e) => {
        this.state.selectedMemberId = e.target.value;
        this.render();
    });

    // Inputs
    bind('apiKey', 'input', (e) => this.state.apiKey = e.target.value);
    bind('token', 'input', (e) => this.state.token = e.target.value);
    bind('boardId', 'input', (e) => this.state.boardId = e.target.value);
    bind('webhookUrl', 'input', (e) => this.state.webhookUrl = e.target.value);
    bind('groqApiKey', 'input', (e) => this.state.groqApiKey = e.target.value);

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

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
