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
    const boardName = this.state.availableBoards?.find(b => b.id === this.state.boardId)?.name || 'Quadro Trello';

    // Mostrar mensagem de loading
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold flex items-center gap-2';
    loadingMsg.innerHTML = '<span class="animate-spin">⌛</span> Gerando PDF...';
    document.body.appendChild(loadingMsg);

    try {
        // Capturar o elemento como imagem
        const canvas = await html2canvas(appElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#0f172a', // Fundo base escuro
            logging: false,
            width: 1400,
            windowWidth: 1400,
            onclone: (clonedDoc) => {
                const doc = clonedDoc;

                // 1. INJETAR CABEÇALHO DO RELATÓRIO
                const main = doc.querySelector('main');
                const headerDiv = doc.createElement('div');
                headerDiv.innerHTML = `
                    <div style="margin-bottom: 40px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
                        <h1 style="color: white; font-size: 32px; font-weight: 800; margin-bottom: 10px;">${boardName}</h1>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8; font-size: 16px; font-weight: bold;">Relatório de Performance</span>
                            <span style="color: #64748b; font-size: 14px;">Gerado em: ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}</span>
                        </div>
                    </div>
                `;
                if (main) main.insertBefore(headerDiv, main.firstChild);

                // 2. FORÇAR CORES ESCURAS (Correção do fundo branco)
                // Reaplica a cor de fundo #1e293b em todos os cartões que a perderam
                const cards = doc.querySelectorAll('.bg-\\[\\#1e293b\\], .bg-gray-800, .bg-slate-800');
                cards.forEach(c => {
                    c.style.backgroundColor = '#1e293b'; // Slate-800
                    c.style.borderColor = '#334155'; // Slate-700
                    c.style.color = 'white';
                });

                // 3. CORREÇÃO DAS BARRAS DO PIPELINE
                // Remove transições para garantir que a barra é capturada "cheia"
                const progressBars = doc.querySelectorAll('.transition-all');
                progressBars.forEach(bar => {
                    bar.style.transition = 'none'; // Remove animação
                    // Garante que a largura inline é respeitada
                    const w = bar.style.width;
                    if (w) bar.style.width = w;
                    // Garante cor de fundo se definida inline
                    const bg = bar.style.backgroundColor;
                    if (bg) bar.style.backgroundColor = bg;
                });

                const style = doc.createElement('style');
                style.innerHTML = `
                    .gap-4 { gap: 2rem !important; }
                    .mb-1 { margin-bottom: 0.5rem !important; }
                    .text-white { color: #f8fafc !important; }
                    .bg-\\[\\#1e293b\\] { background-color: #1e293b !important; }
                    
                    /* Tabela Headers */
                    th { 
                        background-color: #0f172a !important; 
                        color: #94a3b8 !important;   
                        padding: 16px !important;
                    }

                    /* Scrollbar */
                    .custom-scrollbar-dark::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 10px; }

                    .group .opacity-0 { opacity: 1 !important; }

                    /* CRITICAL: Espaçamento Pós-Pipeline */
                    #section-pipeline {
                        margin-bottom: 80px !important; /* Espaço extra forçado */
                        page-break-inside: avoid;
                    }

                    /* CRITICAL: Layout Clean */
                    .grid { height: auto !important; } /* Remover alturas fixas dos grids */
                `;
                doc.head.appendChild(style);

                // 4. Ocultar Lixo UI e Focus Zone
                const elementsToHide = [
                    'aside',
                    'header',
                    '#section-actions', // OCULTAR COMPLETO (Focus Zone)
                    '#chatModal',
                    '#resetHiddenListsBtn',
                    '#atualizarBtn',
                    '#toggleChatBtn',
                    '.remove-funnel-list-btn'
                ];
                elementsToHide.forEach(sel => {
                    const el = doc.querySelector(sel);
                    if (el) el.style.display = 'none';
                });

                // 5. Destruir Limites de Layout
                const elsToUnlock = doc.querySelectorAll('.h-screen, .overflow-hidden, .overflow-y-auto, .fixed, .absolute, .max-h-full, .custom-scrollbar-dark');
                elsToUnlock.forEach(el => {
                    el.classList.remove('h-screen', 'overflow-hidden', 'overflow-y-auto', 'fixed', 'absolute', 'max-h-screen');
                    el.style.height = 'auto';
                    el.style.overflow = 'visible';
                    el.style.position = 'static';
                });

                // 6. Ajustar Containers Principais
                if (main) {
                    main.style.margin = '0';
                    main.style.padding = '40px';
                    main.style.width = '100%';
                }
                const appDiv = doc.getElementById('app');
                if (appDiv) {
                    appDiv.style.width = '1400px';
                    appDiv.style.height = 'auto';
                    appDiv.style.display = 'block';
                    appDiv.style.backgroundColor = '#0f172a';
                }

                // 7. Layout Vertical
                const grids = doc.querySelectorAll('.grid');
                grids.forEach(g => {
                    g.style.display = 'flex';
                    g.style.flexDirection = 'column';
                    g.style.gap = '40px';
                });

                // Aumentar espaçamento nos items do Pipeline
                const pipelineItems = doc.querySelectorAll('#section-pipeline > div > div');
                if (pipelineItems) {
                    pipelineItems.forEach(item => item.style.marginBottom = '20px');
                }

                // 8. Tabela Layout
                const tables = doc.querySelectorAll('.overflow-x-auto');
                tables.forEach(t => {
                    t.style.overflow = 'visible';
                    t.style.display = 'block';
                    t.parentElement.style.marginBottom = '40px';
                });
            }
        });

        // Criar PDF
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/jpeg', 0.9);

        // PDF Longo
        const pdfWidth = 210;
        const imgProps = new jsPDF().getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const pdf = new jsPDF({
            orientation: 'p', // Portrait
            unit: 'mm',
            format: [pdfWidth, imgHeight + 20]
        });

        // Pintar fundo
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pdfWidth, imgHeight + 20, 'F');

        // Adicionar imagem
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

        // Salvar
        const dataAtual = new Date().toISOString().split('T')[0];
        const nomeArquivo = `Relatorio_${(boardName || 'Trello').replace(/\s+/g, '_')}_${dataAtual}.pdf`;
        pdf.save(nomeArquivo);

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
    if (!webhookUrl) return alert('Configure URL do Webhook.');

    // Mock simples para não quebrar
    alert("Funcionalidade em manutenção.");
};
