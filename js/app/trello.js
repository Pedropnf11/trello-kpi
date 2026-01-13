App.listarBoards = async function () {
    this.updateState({ loading: true, error: '' });

    try {
        const boards = await TrelloAPI.fetchBoards(this.state.apiKey, this.state.token);
        this.updateState({
            loading: false,
            availableBoards: boards,
            boardId: '' // Forçar seleção
        });
    } catch (err) {
        if (err.status === 401) {
            this.logout(); // Token expirou
        } else {
            this.updateState({ loading: false, error: 'Erro ao buscar quadros: ' + err.message });
        }
    }
};

App.selecionarBoard = function (boardId) {
    this.state.boardId = boardId;
    localStorage.setItem('trello_board_id', boardId);
    this.conectarTrello();
};

App.logout = function () {
    localStorage.removeItem('trello_token');
    // localStorage.removeItem('trello_board_id'); // Opcional: manter board preferido
    this.updateState({
        token: '',
        kpis: null,
        availableBoards: [],
        showConfig: true
    });
    window.location.hash = '';
};

App.conectarTrello = async function () {
    const { apiKey, token, boardId } = this.state;

    if (!apiKey || !token || !boardId) {
        this.state.error = 'Preencha todos os campos';
        this.render();
        return;
    }

    // Salvar no localStorage
    localStorage.setItem('trello_api_key', apiKey);
    localStorage.setItem('trello_token', token);
    localStorage.setItem('trello_board_id', boardId);
    if (this.state.webhookUrl) {
        localStorage.setItem('trello_webhook_url', this.state.webhookUrl);
    }
    if (this.state.groqApiKey) {
        localStorage.setItem('trello_groq_key', this.state.groqApiKey);
    }

    this.updateState({ loading: true, error: '' });

    try {
        const listas = await TrelloAPI.fetchLists(apiKey, token, boardId);
        const cards = await TrelloAPI.fetchCards(apiKey, token, boardId);
        const membros = await TrelloAPI.fetchMembers(apiKey, token, boardId);

        const kpis = KPILogic.processarKPIs(cards, listas, this.state.startDate, this.state.endDate);
        const temposListas = KPILogic.calcularTemposListas(cards, listas, this.state.startDate, this.state.endDate);
        const atividade = KPILogic.calcularAtividade(cards, membros, this.state.startDate, this.state.endDate);

        // Calcular funil com todas as listas (respeitando ocultas)
        const funil = KPILogic.calcularFunilTodasListas(listas, kpis.geral.listCounts, this.state.hiddenFunnelLists);

        // Guardar dados brutos para o Chatbot
        this.state.rawData = { cards, listas, membros, userRole: this.state.userRole };
        this.state.kpis = { ...kpis, temposListas, atividade, funil };

        this.updateState({
            loading: false,
            showConfig: false,
            error: ''
        });

    } catch (err) {
        console.error('Erro Trello:', err);
        if (err.status === 401 || err.status === 403) {
            this.logout();
        } else {
            this.updateState({
                loading: false,
                error: err.message || 'Erro ao conectar ao Trello'
            });
        }
    }
};
