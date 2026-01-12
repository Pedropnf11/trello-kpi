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

        // Guardar dados brutos para o Chatbot
        this.state.rawData = { cards, listas, membros };
        this.state.kpis = { ...kpis, temposListas, atividade };

        this.updateState({
            loading: false,
            showConfig: false,
            error: ''
        });

    } catch (err) {
        this.updateState({
            loading: false,
            error: err.message || 'Erro ao conectar ao Trello'
        });
    }
};
