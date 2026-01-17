App.listarBoards = async function () {
    this.updateState({ loading: true, error: '' });

    try {
        const userInfo = await TrelloAPI.fetchUserInfo(this.state.apiKey, this.state.token);
        const boards = await TrelloAPI.fetchBoards(this.state.apiKey, this.state.token);

        // FILTRO DE PERMISSÕES
        let filteredBoards = boards;

        if (this.state.userRole === 'manager') {
            // GESTOR: Ver apenas quadros onde sou ADMIN
            filteredBoards = boards.filter(b => {
                const myMembership = b.memberships?.find(m => m.idMember === userInfo.id);
                return myMembership && myMembership.memberType === 'admin';
            });
        } else if (this.state.userRole === 'sales') {
            // VENDEDOR: Ver apenas quadros onde NÃO sou ADMIN (ou seja, normal ou observer)
            filteredBoards = boards.filter(b => {
                const myMembership = b.memberships?.find(m => m.idMember === userInfo.id);
                return myMembership && myMembership.memberType !== 'admin';
            });
        }

        // Se não sobrar nenhum, mostra aviso ou todos (fallback)
        if (filteredBoards.length === 0 && boards.length > 0) {
            console.warn('Filtro de permissões removeu todos os quadros. Mostrando todos por segurança.');
            // filteredBoards = boards; // Opcional: descomentar se quiser fallback
        }

        this.updateState({
            loading: false,
            availableBoards: filteredBoards,
            boardId: '', // Forçar seleção
            currentUser: userInfo
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
    localStorage.clear(); // Limpar tudo para garantir segurança máxima
    window.location.hash = ''; // Limpar token da URL se existir
    window.location.reload();
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

    // Se já temos KPIs (dashboard carregado), NÃO mostramos loading screen
    const isRefresh = (this.state.kpis !== null && this.state.kpis !== undefined);

    // Forçar loading a false se for refresh, garantindo que UI não pisca
    this.updateState({
        loading: isRefresh ? false : true,
        refreshing: isRefresh,
        error: ''
    });

    // Feedback visual imediato se for refresh (para não parecer que travou)
    if (isRefresh) {
        // Tentar encontrar o botão mesmo que o DOM vá ser limpo logo a seguir
        // Nota: Como o App.render é chamado no updateState, este botão perde-se
        // A solução ideal seria o App.render lidar com o estado 'refreshing' sem limpar tudo
        // Mas por agora, garantimos que 'loading' é false para evitar o Ecrã de Login
    }

    try {
        const listas = await TrelloAPI.fetchLists(apiKey, token, boardId);
        const cards = await TrelloAPI.fetchCards(apiKey, token, boardId);
        const membros = await TrelloAPI.fetchMembers(apiKey, token, boardId);

        // Identificar Utilizador Atual
        const userInfo = await TrelloAPI.fetchUserInfo(apiKey, token);
        this.state.currentUser = userInfo;

        // Lógica de Permissão: Se for Vendedor, forçar filtro para ele mesmo
        if (this.state.userRole === 'sales') {
            const myMember = membros.find(m => m.id === userInfo.id || m.username === userInfo.username);
            if (myMember) {
                this.state.selectedMemberId = myMember.id;
            } else {
                console.warn('Utilizador atual não encontrado na lista de membros deste quadro.');
            }
        }

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
            refreshing: false,
            showConfig: false,
            error: ''
        });

        const btn = document.getElementById('atualizarBtn');
        if (btn) btn.classList.remove('animate-spin');

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
