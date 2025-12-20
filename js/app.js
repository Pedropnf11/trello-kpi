const App = {
    state: {
        apiKey: localStorage.getItem('trello_api_key') || '',
        token: localStorage.getItem('trello_token') || '',
        boardId: localStorage.getItem('trello_board_id') || '',
        webhookUrl: localStorage.getItem('trello_webhook_url') || 'https://hook.eu1.make.com/d7bsp420w5lt67xg8cq2ha1hege2rn01',
        showConfig: true,
        loading: false,
        kpis: null,
        selectedMemberId: '',
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

        this.updateState({ loading: true, error: '' });

        try {
            const listas = await TrelloAPI.fetchLists(apiKey, token, boardId);
            const cards = await TrelloAPI.fetchCards(apiKey, token, boardId);
            const membros = await TrelloAPI.fetchMembers(apiKey, token, boardId);

            const kpis = KPILogic.processarKPIs(cards, listas);
            const temposListas = KPILogic.calcularTemposListas(cards, listas);
            const atividade = KPILogic.calcularAtividade(cards, membros);

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
            // Gerar o PDF em Base64
            const pdfDataUri = await exportarPDFMelhorado(true);

            if (!pdfDataUri) {
                throw new Error("Falha ao gerar o PDF");
            }

            btn.textContent = 'Enviando...';

            const payload = {
                boardId: this.state.boardId,
                generatedAt: new Date().toISOString(),
                pdfFile: pdfDataUri, // PDF em Base64 (Data URI)
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
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
