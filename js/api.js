// Trello API Interactions
const TrelloAPI = {
    // Rate limiting
    _requestCount: 0,
    _lastReset: Date.now(),
    _MAX_REQUESTS_PER_MINUTE: 100,

    _checkRateLimit() {
        const now = Date.now();

        // Reset counter every minute
        if (now - this._lastReset > 60000) {
            this._requestCount = 0;
            this._lastReset = now;
        }

        if (this._requestCount >= this._MAX_REQUESTS_PER_MINUTE) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }

        this._requestCount++;
    },

    // Input validation
    _validateId(id, type = 'ID') {
        if (!id || typeof id !== 'string') {
            throw new Error(`Invalid ${type}: must be a string`);
        }

        // Trello IDs are 24 character alphanumeric
        if (!/^[a-zA-Z0-9]{24}$/.test(id)) {
            throw new Error(`Invalid ${type} format`);
        }

        return id;
    },

    async _fetch(url) {
        this._checkRateLimit();

        const res = await fetch(url);
        if (!res.ok) {
            const error = new Error(`Request failed with status ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return await res.json();
    },

    async fetchBoards(apiKey, token) {
        // Fetch open boards for the user with memberships to check admin status
        return this._fetch(`https://api.trello.com/1/members/me/boards?filter=open&fields=id,name,dateLastActivity,memberships&key=${apiKey}&token=${token}`);
    },

    async fetchUserInfo(apiKey, token) {
        return this._fetch(`https://api.trello.com/1/members/me?key=${apiKey}&token=${token}`);
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

        // Limit increased to 1000 actions to get better history
        // Corrected actions parameter: 'updateCard:idList' -> 'updateCard' to avoid 403 errors
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

    async createCard(apiKey, token, listId, name, desc) {
        const validListId = this._validateId(listId, 'List ID');

        this._checkRateLimit();

        const url = `https://api.trello.com/1/cards?idList=${validListId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&key=${apiKey}&token=${token}`;
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to create card');
        return await res.json();
    },

    async addComment(apiKey, token, cardId, text) {
        const validCardId = this._validateId(cardId, 'Card ID');

        this._checkRateLimit();

        const url = `https://api.trello.com/1/cards/${validCardId}/actions/comments?text=${encodeURIComponent(text)}&key=${apiKey}&token=${token}`;
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to add comment');
        return await res.json();
    }
};

// Expose to window for global access
window.TrelloAPI = TrelloAPI;
