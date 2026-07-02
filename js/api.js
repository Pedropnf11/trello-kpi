// Trello API Interactions
const TrelloAPI = {
    _requestCount: 0,
    _lastReset: Date.now(),
    _MAX_REQUESTS_PER_MINUTE: 100,

    _checkRateLimit() {
        const now = Date.now();

        if (now - this._lastReset > 60000) {
            this._requestCount = 0;
            this._lastReset = now;
        }

        if (this._requestCount >= this._MAX_REQUESTS_PER_MINUTE) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }

        this._requestCount++;
    },

    _validateId(id, type = 'ID') {
        if (!id || typeof id !== 'string') {
            throw new Error(`Invalid ${type}: must be a string`);
        }

        if (!/^[a-zA-Z0-9]{24}$/.test(id)) {
            throw new Error(`Invalid ${type} format`);
        }

        return id;
    },

    async _fetch(url) {
        this._checkRateLimit();

        const res = await fetch(url);
        if (!res.ok) {
            let details = '';
            try {
                details = await res.text();
            } catch {
                details = '';
            }

            const error = new Error(details || `Request failed with status ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return await res.json();
    },

    async fetchBoards(apiKey, token) {
        const params = new URLSearchParams({
            filter: 'open',
            fields: 'id,name,dateLastActivity,memberships',
            lists: 'none',
            organization: 'false',
            key: apiKey,
            token
        });

        try {
            return await this._fetch(`https://api.trello.com/1/members/me/boards?${params.toString()}`);
        } catch (err) {
            if (err.status !== 400 && err.status !== 401) throw err;

            params.set('fields', 'id,name,dateLastActivity');
            return this._fetch(`https://api.trello.com/1/members/me/boards?${params.toString()}`);
        }
    },

    async fetchUserInfo(apiKey, token) {
        const params = new URLSearchParams({
            fields: 'id,username,fullName',
            key: apiKey,
            token
        });

        return this._fetch(`https://api.trello.com/1/members/me?${params.toString()}`);
    },

    async fetchLists(apiKey, token, boardId) {
        const validBoardId = this._validateId(boardId, 'Board ID');

        const data = await this._fetch(
            `https://api.trello.com/1/boards/${validBoardId}/lists?key=${apiKey}&token=${token}`
        );
        if (data.error || !Array.isArray(data)) {
            throw new Error('Erro ao conectar. Verifique suas credenciais.');
        }
        return data;
    },

    async fetchCards(apiKey, token, boardId) {
        const validBoardId = this._validateId(boardId, 'Board ID');

        return this._fetch(
            `https://api.trello.com/1/boards/${validBoardId}/cards?members=true&actions=commentCard,createCard,updateCard&actions_limit=1000&actions_memberCreator=true&key=${apiKey}&token=${token}`
        );
    },

    async fetchMembers(apiKey, token, boardId) {
        const validBoardId = this._validateId(boardId, 'Board ID');

        return this._fetch(
            `https://api.trello.com/1/boards/${validBoardId}/members?key=${apiKey}&token=${token}`
        );
    },

    async createCard(apiKey, token, listId, name, desc, due = null, memberIds = []) {
        const validListId = this._validateId(listId, 'List ID');

        this._checkRateLimit();

        let url = `https://api.trello.com/1/cards?idList=${validListId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&key=${apiKey}&token=${token}`;
        if (due) url += `&due=${encodeURIComponent(due)}`;
        if (memberIds.length) {
            const validMemberIds = memberIds.map(id => this._validateId(id, 'Member ID'));
            url += `&idMembers=${encodeURIComponent(validMemberIds.join(','))}`;
        }
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) {
            let details = '';
            try {
                details = await res.text();
            } catch {
                details = '';
            }

            const error = new Error(details || 'Failed to create card');
            error.status = res.status;
            throw error;
        }
        return await res.json();
    },

    async addComment(apiKey, token, cardId, text) {
        const validCardId = this._validateId(cardId, 'Card ID');

        this._checkRateLimit();

        const url = `https://api.trello.com/1/cards/${validCardId}/actions/comments?text=${encodeURIComponent(text)}&key=${apiKey}&token=${token}`;
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) {
            let details = '';
            try {
                details = await res.text();
            } catch {
                details = '';
            }

            const error = new Error(details || 'Failed to add comment');
            error.status = res.status;
            throw error;
        }
        return await res.json();
    }
};

window.TrelloAPI = TrelloAPI;
