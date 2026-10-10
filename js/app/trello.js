App.listarBoards = async function () {
    this.updateState({ loading: true, error: '' });

    try {
        const userInfo = await TrelloAPI.fetchUserInfo(this.state.apiKey, this.state.token);
        const boards = await TrelloAPI.fetchBoards(this.state.apiKey, this.state.token);

        if (!Array.isArray(boards)) {
            throw new Error('Resposta inesperada ao buscar quadros do Trello.');
        }

        let filteredBoards = boards;

        if (this.state.userRole === 'manager') {
            const adminBoards = boards.filter(b => {
                const myMembership = b.memberships?.find(m => m.idMember === userInfo.id);
                return myMembership && myMembership.memberType === 'admin';
            });
            filteredBoards = adminBoards.length > 0 ? adminBoards : boards;
            if (adminBoards.length === 0 && boards.length > 0) {
            }
        } else if (this.state.userRole === 'sales') {
            const salesBoards = boards.filter(b => {
                const myMembership = b.memberships?.find(m => m.idMember === userInfo.id);
                return myMembership && myMembership.memberType !== 'admin';
            });
            filteredBoards = salesBoards.length > 0 ? salesBoards : boards;
            if (salesBoards.length === 0 && boards.length > 0) {
            }
        }

        this.updateState({
            loading: false,
            availableBoards: filteredBoards,
            boardId: '',
            currentUser: userInfo
        });
    } catch (err) {
        if (err.status === 401) {
            this.updateState({
                loading: false,
                error: 'A autorizacao do Trello nao permitiu carregar os quadros. Clica em Sair e autoriza novamente.'
            });
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
    localStorage.clear();
    window.location.hash = '';
    window.location.reload();
};

App.conectarTrello = async function () {
    const { apiKey, token, boardId } = this.state;

    if (!apiKey || !token || !boardId) {
        this.state.error = 'Preencha todos os campos';
        this.render();
        return;
    }

    localStorage.setItem('trello_api_key', apiKey);
    localStorage.setItem('trello_token', token);
    localStorage.setItem('trello_board_id', boardId);
    if (this.state.webhookUrl) {
        localStorage.setItem('trello_webhook_url', this.state.webhookUrl);
    }
    if (this.state.groqApiKey) {
        sessionStorage.setItem('trello_groq_key', this.state.groqApiKey);
    }

    this.updateState({
        loading: true,
        refreshing: false,
        error: '',
        boardNotAdminError: false,
        isBoardAdmin: false
    });

    try {
        const listas = await TrelloAPI.fetchLists(apiKey, token, boardId);
        const cards = await TrelloAPI.fetchCards(apiKey, token, boardId);
        const membros = await TrelloAPI.fetchMembers(apiKey, token, boardId);

        const userInfo = await TrelloAPI.fetchUserInfo(apiKey, token);
        this.state.currentUser = userInfo;

        // Fetch board details to accurately check membership type
        let isBoardAdmin = false;
        try {
            const boardInfo = await TrelloAPI.fetchBoard(apiKey, token, boardId);
            const myMembership = boardInfo.memberships?.find(m => m.idMember === userInfo.id);
            isBoardAdmin = myMembership?.memberType === 'admin';
        } catch (e) {
            console.warn('Could not verify board admin membership specifically:', e);
        }
        this.state.isBoardAdmin = isBoardAdmin;

        // The board membership is the source of truth for the dashboard view.
        // This prevents a saved/selected Agent role from opening an admin board
        // with the restricted dashboard after following a Trello deep link.
        this.state.userRole = isBoardAdmin ? 'manager' : 'sales';
        localStorage.setItem('trello_user_role', this.state.userRole);

        if (window.ActiveTracker) {
            window.ActiveTracker.init({ id: userInfo.id, name: userInfo.fullName || userInfo.username });
        }

        // Se for manager, garante que o selectedMemberId é limpo para mostrar dados de todos
        if (this.state.userRole === 'manager') {
            this.state.selectedMemberId = '';
        }

        if (this.state.userRole === 'sales') {
            const myMember = membros.find(m => m.id === userInfo.id || m.username === userInfo.username);
            if (myMember) {
                this.state.selectedMemberId = myMember.id;
            }
        }

        const kpis = KPILogic.processarKPIs(cards, listas, this.state.startDate, this.state.endDate);
        const temposListas = KPILogic.calcularTemposListas(cards, listas, this.state.startDate, this.state.endDate);
        const atividade = KPILogic.calcularAtividade(cards, membros, this.state.startDate, this.state.endDate);

        const funil = KPILogic.calcularFunilTodasListas(listas, kpis.geral.listCounts, this.state.hiddenFunnelLists);

        this.state.rawData = { cards, listas, membros, userRole: this.state.userRole, isBoardAdmin: this.state.isBoardAdmin };
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
        if (err.status === 401) {
            this.logout();
        } else {
            this.updateState({
                loading: false,
                error: err.message || 'Erro ao conectar ao Trello'
            });
        }
    }
};
