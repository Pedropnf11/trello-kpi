// Trello API Interactions
const TrelloAPI = {
    async fetchLists(apiKey, token, boardId) {
        const res = await fetch(
            `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`
        );
        const data = await res.json();
        if (data.error || !Array.isArray(data)) {
            throw new Error('Erro ao conectar. Verifique suas credenciais.');
        }
        return data;
    },

    async fetchCards(apiKey, token, boardId) {
        const res = await fetch(
            `https://api.trello.com/1/boards/${boardId}/cards?members=true&actions=commentCard,createCard,updateCard:idList&actions_limit=1000&actions_memberCreator=true&key=${apiKey}&token=${token}`
        );
        return await res.json();
    },

    async fetchMembers(apiKey, token, boardId) {
        const res = await fetch(
            `https://api.trello.com/1/boards/${boardId}/members?key=${apiKey}&token=${token}`
        );
        return await res.json();
    }
};
