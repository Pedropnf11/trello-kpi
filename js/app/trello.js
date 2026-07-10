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

    const isRefresh = (this.state.kpis !== null && this.state.kpis !== undefined);

    this.updateState({
        loading: isRefresh ? false : true,
        refreshing: isRefresh,
        error: ''
    });

    try {
        const listas = await TrelloAPI.fetchLists(apiKey, token, boardId);
        const cards = await TrelloAPI.fetchCards(apiKey, token, boardId);
        const membros = await TrelloAPI.fetchMembers(apiKey, token, boardId);

        const userInfo = await TrelloAPI.fetchUserInfo(apiKey, token);
        this.state.currentUser = userInfo;

        const isFromPowerUp = localStorage.getItem('trello_from_powerup') === 'true';
        localStorage.removeItem('trello_from_powerup'); // Consume flag

        if (isFromPowerUp) {
            try {
                const boards = await TrelloAPI.fetchBoards(apiKey, token);
                const currentBoard = boards.find(b => b.id === boardId);
                if (currentBoard) {
                    const myMembership = currentBoard.memberships?.find(m => m.idMember === userInfo.id);
                    const isAdmin = myMembership && myMembership.memberType === 'admin';
                    const determinedRole = isAdmin ? 'manager' : 'sales';
                    this.state.userRole = determinedRole;
                    localStorage.setItem('trello_user_role', determinedRole);
                } else {
                    if (!this.state.userRole) {
                        this.state.userRole = 'sales';
                        localStorage.setItem('trello_user_role', 'sales');
                    }
                }
            } catch (e) {
                console.warn('Erro ao verificar permissão do quadro vindo do Power-Up:', e);
                if (!this.state.userRole) {
                    this.state.userRole = 'sales';
                    localStorage.setItem('trello_user_role', 'sales');
                }
            }
        } else {
            if (this.state.userRole === 'manager') {
                let availableBoards = this.state.availableBoards || [];
                if (availableBoards.length === 0) {
                    try {
                        availableBoards = await TrelloAPI.fetchBoards(apiKey, token);
                        this.state.availableBoards = availableBoards;
                    } catch (e) {
                        console.warn('Erro ao carregar quadros para validação de gestor:', e);
                    }
                }
                const currentBoard = availableBoards.find(b => b.id === boardId);
                if (!currentBoard) {
                    this.state.userRole = 'sales';
                    localStorage.setItem('trello_user_role', 'sales');
                }
            }
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
