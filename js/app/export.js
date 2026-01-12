App.exportarExcel = function () {
    if (!this.state.kpis) return;

    const listsDef = this.state.kpis.listsDef;
    const headers = ['Período', 'Consultor', 'Comentários', 'Total Leads', ...listsDef.map(l => l.name)];

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
};

App.exportarPDF = async function () {
    if (!this.state.kpis) return;

    const appElement = document.getElementById('app');

    // Mostrar mensagem de loading
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
};

App.enviarWebhook = async function () {
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
        // Usa a função melhorada se disponível, senão fallback (embora fallback não retorne base64 aqui neste código simples, assume-se que exportarPDFMelhorado existe)
        const pdfDataUri = window.exportarPDFMelhorado ? await window.exportarPDFMelhorado(true) : null;

        if (!pdfDataUri) throw new Error("Função de exportação PDF Melhorada não disponível ou falhou.");

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
};
