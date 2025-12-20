const App = {
    state: {
        apiKey: localStorage.getItem('trello_api_key') || '',
        token: localStorage.getItem('trello_token') || '',
        boardId: localStorage.getItem('trello_board_id') || '',
        boardId: localStorage.getItem('trello_board_id') || '',
        webhookUrl: localStorage.getItem('trello_webhook_url') || 'https://hook.eu1.make.com/d7bsp420w5lt67xg8cq2ha1hege2rn01',
        groqApiKey: localStorage.getItem('trello_groq_key') || '',
        showConfig: true,
        loading: false,
        kpis: null,
        kpis: null,
        selectedMemberId: '',
        startDate: '',
        endDate: '',
        error: ''
    },

    init() {
        this.render();
    },

    async conectarTrello() {
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
    },

    exportarExcel() {
        if (!this.state.kpis) return;

        const listsDef = this.state.kpis.listsDef;
        const listHeaders = listsDef.map(l => l.name);
        const headers = ['Período', 'Consultor', 'Comentários', 'Total Leads', ...listHeaders];

        const gerarLinhas = (dados, periodo) => dados.consultores.map(c => [
            periodo,
            c.nome,
            c.comentarios,
            c.leads,
            ...listsDef.map(l => c.listCounts[l.id] || 0)
        ]);

        const rowsGeral = gerarLinhas(this.state.kpis.geral, 'Geral');
        const rowsSemanal = gerarLinhas(this.state.kpis.semanal, 'Esta Semana');

        Utils.generateCSV(
            headers,
            [...rowsGeral, ...rowsSemanal],
            `kpis_trello_completo_${new Date().toISOString().split('T')[0]}.csv`
        );
    },

    async exportarPDF() {
        if (!this.state.kpis) return;

        const appElement = document.getElementById('app');

        // Mostrar mensagem de loading
        const originalContent = appElement.innerHTML;
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50';
        loadingMsg.textContent = '📄 Gerando PDF...';
        document.body.appendChild(loadingMsg);

        try {
            // Capturar o elemento como imagem
            const canvas = await html2canvas(appElement, {
                scale: 2,
                backgroundColor: '#f9fafb',
                logging: false,
                windowWidth: 1400
            });

            // Criar PDF
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 297; // A4 landscape width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Adicionar primeira página
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 210; // A4 height

            // Adicionar páginas adicionais se necessário
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= 210;
            }

            // Salvar PDF
            const dataAtual = new Date().toISOString().split('T')[0];
            pdf.save(`KPI_Dashboard_${dataAtual}.pdf`);

            // Remover loading
            document.body.removeChild(loadingMsg);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            document.body.removeChild(loadingMsg);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    },

    async gerarAnaliseIA(kpis) {
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
    },

    async enviarWebhook() {
        if (!this.state.kpis) return;

        const webhookUrl = this.state.webhookUrl;
        if (!webhookUrl) {
            alert('Por favor, configure a URL do Webhook nas configurações (ícone de engrenagem).');
            return;
        }

        const btn = document.getElementById('enviarWebhookBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Gerando PDF...';
        btn.disabled = true;

        try {
            // 1. Gerar o PDF em Base64
            const pdfDataUri = await exportarPDFMelhorado(true);

            // 2. Gerar Análise de IA (se chave existir)
            let aiAnalysis = null;
            if (this.state.groqApiKey) {
                btn.textContent = 'Consultando AI...';
                aiAnalysis = await this.gerarAnaliseIA(this.state.kpis);
            }

            btn.textContent = 'Enviando...';

            // 3. Montar Payload
            const payload = {
                boardId: this.state.boardId,
                generatedAt: new Date().toISOString(),
                pdfFile: pdfDataUri,
                aiAnalysis: aiAnalysis, // Texto HTML gerado pela IA
                kpis: this.state.kpis
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('PDF e Dados enviados com sucesso para o Webhook!');
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('Erro ao enviar webhook:', error);
            alert('Falha ao enviar para o Webhook:\n' + error.message);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    },

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    },

    render() {
        const app = document.getElementById('app');

        if (this.state.showConfig || !this.state.kpis) {
            app.innerHTML = UI.renderConfig(this.state);
        } else {
            app.innerHTML = UI.renderDashboard(this.state);
        }

        this.attachEvents();
    },

    attachEvents() {
        // Event delegation or direct binding
        const bind = (id, event, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, handler);
        };

        bind('conectarBtn', 'click', () => this.conectarTrello());
        bind('atualizarBtn', 'click', () => this.conectarTrello());
        bind('exportarBtn', 'click', () => this.exportarExcel());
        bind('exportarPdfBtn', 'click', () => exportarPDFMelhorado());
        bind('enviarWebhookBtn', 'click', () => this.enviarWebhook());

        bind('configBtn', 'click', () => {
            this.updateState({ showConfig: true });
        });

        bind('memberFilter', 'change', (e) => {
            this.state.selectedMemberId = e.target.value;
            this.render();
        });

        // Inputs
        bind('apiKey', 'input', (e) => this.state.apiKey = e.target.value);
        bind('token', 'input', (e) => this.state.token = e.target.value);
        bind('boardId', 'input', (e) => this.state.boardId = e.target.value);
        bind('webhookUrl', 'input', (e) => this.state.webhookUrl = e.target.value);
        bind('groqApiKey', 'input', (e) => this.state.groqApiKey = e.target.value);

        bind('startDate', 'change', (e) => {
            this.state.startDate = e.target.value;
            this.conectarTrello();
        });

        bind('endDate', 'change', (e) => {
            this.state.endDate = e.target.value;
            this.conectarTrello();
        });

        bind('clearDates', 'click', () => {
            this.state.startDate = '';
            this.state.endDate = '';
            this.conectarTrello();
        });

        // Chat Events
        bind('toggleChatBtn', 'click', () => this.toggleChat());
        bind('closeChatBtn', 'click', () => this.toggleChat());
        bind('sendChatBtn', 'click', () => this.enviarMensagemChat());
        bind('chatInput', 'keypress', (e) => {
            if (e.key === 'Enter') this.enviarMensagemChat();
        });
    },

    toggleChat() {
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
    },

    addChatMessage(role, text) {
        this.state.chatHistory.push({ role, content: text });
        this.renderChatMessages();
    },

    renderChatMessages() {
        const container = document.getElementById('chatMessages');
        container.innerHTML = this.state.chatHistory.map(msg => `
            <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4">
                <div class="${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-3 max-w-[85%] text-sm shadow-sm leading-relaxed">
                    ${msg.role === 'assistant' ? msg.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : msg.content}
                </div>
            </div>
        `).join('');
        this.scrollToBottom();
    },

    scrollToBottom() {
        const container = document.getElementById('chatMessages');
        container.scrollTop = container.scrollHeight;
    },

    async enviarMensagemChat() {
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
    },

    prepararContextoIA() {
        // Filtra e resume os dados para não estourar o limite de tokens
        const { kpis, rawData, startDate, endDate } = this.state;
        
        // Resumo dos Cards Recentes (comentários chave)
        // Pegamos nos últimos 30 actions de comentários para dar contexto de "o que está a ser falado"
        const recentComments = [];
        let commentCount = 0;
        
        // Iterar cards para extrair comentários recentes é pesado, vamos simplificar
        // Vamos focar nos KPIs já processados que são ricos
        
        return {
            periodo: { inicio: startDate, fim: endDate || 'Hoje' },
            resumo_kpis: kpis.semanal, // Dados agregados da semana/periodo
            performance_listas: kpis.temposListas,
            atividade_individual: kpis.atividade,
            // Adicionar detalhes de 'Gargalos' se houver (ex: leads parados há muito tempo na lista Leads)
            top_leads_lentos: kpis.temposListas.leads.maisLento ? [kpis.temposListas.leads.maisLento] : [],
        };
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
