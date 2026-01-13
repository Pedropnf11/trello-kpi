// Trello API Interactions
const TrelloAPI = {
    async _fetch(url) {
        const res = await fetch(url);
        if (!res.ok) {
            const error = new Error(`Request failed with status ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return await res.json();
    },

    async fetchBoards(apiKey, token) {
        // Fetch open boards for the user
        return this._fetch(`https://api.trello.com/1/members/me/boards?filter=open&fields=id,name,dateLastActivity&key=${apiKey}&token=${token}`);
    },

    async fetchLists(apiKey, token, boardId) {
        const data = await this._fetch(
            `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`
        );
        if (data.error || !Array.isArray(data)) {
            throw new Error('Erro ao conectar. Verifique suas credenciais.');
        }
        return data;
    },

    async fetchCards(apiKey, token, boardId) {
        // Limit increased to 1000 actions to get better history
        return this._fetch(
            `https://api.trello.com/1/boards/${boardId}/cards?members=true&actions=commentCard,createCard,updateCard:idList&actions_limit=1000&actions_memberCreator=true&key=${apiKey}&token=${token}`
        );
    },

    async fetchMembers(apiKey, token, boardId) {
        return this._fetch(
            `https://api.trello.com/1/boards/${boardId}/members?key=${apiKey}&token=${token}`
        );
    },

    async createCard(apiKey, token, listId, name, desc) {
        const url = `https://api.trello.com/1/cards?idList=${listId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&key=${apiKey}&token=${token}`;
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to create card');
        return await res.json();
    },

    async addComment(apiKey, token, cardId, text) {
        const url = `https://api.trello.com/1/cards/${cardId}/actions/comments?text=${encodeURIComponent(text)}&key=${apiKey}&token=${token}`;
        const res = await fetch(url, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to add comment');
        return await res.json();
    }
};

// Expose to window for global access
window.TrelloAPI = TrelloAPI;
