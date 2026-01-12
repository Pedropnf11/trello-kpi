App.gerarAnaliseIA = async function (kpis) {
    if (!this.state.groqApiKey) return null;

    try {
        const prompt = `
        Atua como um Diretor Comercial de Elite. Analisa estes dados JSON de uma equipa que usa Trello.
        
        DADOS:
        ${JSON.stringify(kpis.semanal)}

        TAREFAS:
        1. Identifica o consultor com melhor performance (Leads vs Comentários).
        2. Identifica quem precisa de mais atenção (Muitos leads, pouca ação ou vice-versa).
        3. Dá 3 sugestões táticas curtas para a próxima semana para melhorar a equipa.

        FORMATO:
        Escreve em HTML simples (usa <b>, <br>, <ul>, <li>). Sê direto. Não uses Markdown. Começa direto na análise.
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.state.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || "Não foi possível gerar análise.";

    } catch (error) {
        console.error("Erro na AI:", error);
        return null;
    }
};

App.toggleChat = function () {
    this.state.chatOpen = !this.state.chatOpen;
    const modal = document.getElementById('chatModal');
    if (this.state.chatOpen) {
        modal.classList.remove('hidden');
        // Se for a primeira vez abrindo, manda mensagem de boas vindas
        if (this.state.chatHistory.length === 0) {
            this.addChatMessage('assistant', 'Olá! Sou o teu Mentor de Vendas. Analisei todos os leads, comentários e tempos. O que queres saber?');
        }
        this.scrollToBottom();
    } else {
        modal.classList.add('hidden');
    }
};

App.addChatMessage = function (role, text) {
    this.state.chatHistory.push({ role, content: text });
    this.renderChatMessages();
};

App.renderChatMessages = function () {
    const container = document.getElementById('chatMessages');
    container.innerHTML = this.state.chatHistory.map(msg => `
        <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4">
            <div class="${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-3 max-w-[85%] text-sm shadow-sm leading-relaxed">
                ${msg.role === 'assistant' ? msg.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : msg.content}
            </div>
        </div>
    `).join('');
    this.scrollToBottom();
};

App.scrollToBottom = function () {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
};

App.enviarMensagemChat = async function () {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || !this.state.groqApiKey) {
        if (!this.state.groqApiKey) alert('Configura a API Key da Groq nas definições primeiro!');
        return;
    }

    // Limpar input e adicionar mensagem do user
    input.value = '';
    this.addChatMessage('user', text);

    // Loading state
    const loadingId = 'loading-' + Date.now();
    const container = document.getElementById('chatMessages');
    container.insertAdjacentHTML('beforeend', `
        <div id="${loadingId}" class="flex justify-start mb-4">
            <div class="bg-gray-100 text-gray-500 rounded-2xl px-4 py-3 text-sm italic">
                A analisar dados...
            </div>
        </div>
    `);
    this.scrollToBottom();

    try {
        // Preparar Contexto Rico
        const contexto = this.prepararContextoIA();

        const messages = [
            { role: "system", content: "És um Consultor Estratégico de Vendas experiente e analítico. Tens acesso a todos os dados do Trello da equipa. Responde de forma curta, direta e tática. Usa formatação HTML simples (<b>, <br>) se necessário." },
            { role: "user", content: `CONTEXTO DOS DADOS:\n${JSON.stringify(contexto)}` },
            ...this.state.chatHistory.filter(m => m.role !== 'system')
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.state.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: messages,
                temperature: 0.5
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "Desculpa, não consegui analisar.";

        // Remover loading
        document.getElementById(loadingId).remove();

        // Adicionar resposta
        this.addChatMessage('assistant', aiResponse);

    } catch (error) {
        document.getElementById(loadingId).remove();
        this.addChatMessage('assistant', 'Erro ao conectar à IA: ' + error.message);
    }
};

App.prepararContextoIA = function () {
    // Filtra e resume os dados para não estourar o limite de tokens
    const { kpis, rawData, startDate, endDate } = this.state;
    // Resumo dos Cards Recentes (comentários chave) - Simplificado
    return {
        periodo: { inicio: startDate, fim: endDate || 'Hoje' },
        resumo_kpis: kpis.semanal, // Dados agregados da semana/periodo
        performance_listas: kpis.temposListas,
        atividade_individual: kpis.atividade,
        // Adicionar detalhes de 'Gargalos' se houver
        top_leads_lentos: kpis.temposListas.leads.maisLento ? [kpis.temposListas.leads.maisLento] : [],
    };
};
