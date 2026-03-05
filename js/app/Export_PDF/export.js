App.exportarExcel = function () {
    if (!this.state.kpis) return;

    const listsDef = this.state.kpis.listsDef;
    const headers = [(UI._lpLang || 'pt') === 'en' ? 'Period' : 'Período', (UI._lpLang || 'pt') === 'en' ? 'Agent' : 'Consultor', (UI._lpLang || 'pt') === 'en' ? 'Comments' : 'Comentários', (UI._lpLang || 'pt') === 'en' ? 'Total Leads' : 'Total Leads', ...listsDef.map(l => l.name)];

    const gerarLinhas = (dados, periodo) => dados.consultores.map(c => [
        periodo,
        c.nome,
        c.comentarios,
        c.leads,
        ...listsDef.map(l => c.listCounts[l.id] || 0)
    ]);

    const rowsGeral = gerarLinhas(this.state.kpis.geral, (UI._lpLang || 'pt') === 'en' ? 'Overall' : 'Geral');
    const rowsSemanal = gerarLinhas(this.state.kpis.semanal, (UI._lpLang || 'pt') === 'en' ? 'This Week' : 'Esta Semana');

    Utils.generateCSV(
        headers,
        [...rowsGeral, ...rowsSemanal],
        `kpis_trello_completo_${new Date().toISOString().split('T')[0]}.csv`
    );
};

App.exportarPDF = async function (returnContent = false) {
    if (!this.state.kpis) return;

    const appElement = document.getElementById('app');
    const boardName = this.state.availableBoards?.find(b => b.id === this.state.boardId)?.name || ((UI._lpLang || 'pt') === 'en' ? 'Trello Board' : 'Quadro Trello');

    // Mostrar mensagem de loading
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold flex items-center gap-2';
    loadingMsg.innerHTML = `<span class="animate-spin">⌛</span> ${(UI._lpLang || 'pt') === 'en' ? 'Generating PDF...' : 'Gerando PDF...'}`;
    document.body.appendChild(loadingMsg);

    try {
        // Capturar o elemento como imagem - Otimizado para evitar crash
        const canvas = await html2canvas(appElement, {
            scale: 1, // Reduzido para estabilidade
            useCORS: true,
            allowTaint: false, // CRÍTICO: Deve ser false para permitir toDataURL()
            backgroundColor: '#0f172a',
            logging: true, // Log para debug se necessário
            width: 1400,
            windowWidth: 1400,
            onclone: (clonedDoc) => {
                const doc = clonedDoc;

                // REMOVER EFEITOS COMPLEXOS QUE QUEBRAM O HTML2CANVAS
                const allElements = doc.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);

                    // 1. Remover Backdrop Filter
                    if (style.backdropFilter !== 'none') {
                        el.style.backdropFilter = 'none';
                        el.style.webkitBackdropFilter = 'none';
                    }

                    // 2. Remover Gradientes Complexos (Causa do erro addColorStop)
                    // Se tiver gradient, mete cor sólida segura
                    if (style.backgroundImage && style.backgroundImage.includes('gradient')) {
                        el.style.backgroundImage = 'none';
                        // Se não tiver cor de fundo definida (era só gradient), mete um fundo escuro padrão
                        if (style.backgroundColor === 'rgba(0, 0, 0, 0)' || style.backgroundColor === 'transparent') {
                            el.style.backgroundColor = '#1e293b'; // Slate-800 safe fallback
                        }
                    }
                });

                // 1. INJETAR CABEÇALHO DO RELATÓRIO
                const main = doc.querySelector('main');
                const headerDiv = doc.createElement('div');
                headerDiv.innerHTML = `
                    <div style="margin-bottom: 40px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
                        <h1 style="color: white; font-size: 32px; font-weight: 800; margin-bottom: 10px;">${boardName}</h1>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94a3b8; font-size: 16px; font-weight: bold;">${(UI._lpLang || 'pt') === 'en' ? 'Performance Report' : 'Relatório de Performance'}</span>
                            <span style="color: #64748b; font-size: 14px;">${(UI._lpLang || 'pt') === 'en' ? 'Generated on:' : 'Gerado em:'} ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}</span>
                        </div>
                    </div>
                `;
                if (main) main.insertBefore(headerDiv, main.firstChild);

                // 2. FORÇAR CORES ESCURAS (Correção do fundo branco)
                // Reaplica a cor de fundo nos cartões que a perderam
                const cards = doc.querySelectorAll('[class*="bg-[#0f172a]"], [class*="bg-[#111827]"], [class*="bg-[#0d1117]"], [class*="bg-[#080c14]"], .bg-gray-800, .bg-slate-800');
                cards.forEach(c => {
                    const cls = c.className || '';
                    if (cls.includes('#111827')) c.style.backgroundColor = '#111827';
                    else if (cls.includes('#0f172a')) c.style.backgroundColor = '#0f172a';
                    else c.style.backgroundColor = '#111827';
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
                    [class*="bg-\\[#0f172a\\]"] { background-color: #0f172a !important; }
                    [class*="bg-\\[#111827\\]"] { background-color: #111827 !important; }
                    [class*="bg-\\[#0d1117\\]"] { background-color: #0d1117 !important; }
                    
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
                        margin-bottom: 80px !important;
                        page-break-inside: avoid;
                    }

                    /* CRITICAL: Layout Clean */
                    .grid { height: auto !important; }
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

                // 7. Layout Vertical - Apenas no container principal se necessário, mas EVITAR partir componentes internos
                // const grids = doc.querySelectorAll('.grid');
                // grids.forEach(g => {
                //    // g.style.display = 'flex';
                //    // g.style.flexDirection = 'column';
                //    // g.style.gap = '40px';
                // });

                // Em vez disso, garantir apenas que o App expanda verticalmente
                if (appDiv) {
                    appDiv.style.height = 'auto';
                    appDiv.style.overflow = 'visible';
                }

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

        const dataAtual = new Date().toISOString().split('T')[0];
        const nomeArquivo = `Relatorio_${(boardName || 'Trello').replace(/\s+/g, '_')}_${dataAtual}.pdf`;

        if (returnContent) {
            document.body.removeChild(loadingMsg);
            return {
                dataUri: pdf.output('datauristring'),
                fileName: nomeArquivo
            };
        }

        // Salvar
        pdf.save(nomeArquivo);

        document.body.removeChild(loadingMsg);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        if (loadingMsg && loadingMsg.parentNode) document.body.removeChild(loadingMsg);
        alert((UI._lpLang || 'pt') === 'en' ? 'Error generating PDF. Please try again.' : 'Erro ao gerar PDF. Tente novamente.');
        return null;
    }
};

App.enviarWebhook = async function () {
    if (!this.state.kpis) return;
    const webhookUrl = this.state.webhookUrl;

    // Check if URL is configured
    if (!webhookUrl) return alert((UI._lpLang || 'pt') === 'en' ? 'Please configure the Webhook URL in the settings first.' : 'Por favor, configure o URL do Webhook nas definições primeiro.');

    // Basic URL validation
    try {
        new URL(webhookUrl);
    } catch (_) {
        return alert((UI._lpLang || 'pt') === 'en' ? 'Invalid Webhook URL.' : 'URL do Webhook inválido.');
    }

    const confirmSend = confirm(`${(UI._lpLang || 'pt') === 'en' ? 'Generate the PDF and send the full report (Data + PDF) to the Webhook?' : 'Pretende gerar o PDF e enviar o relatório completo (Dados + PDF) para o Webhook?'}\n\nURL: ${webhookUrl}`);
    if (!confirmSend) return;

    // 1. Gerar PDF
    const pdfResult = await this.exportarPDF(true);
    if (!pdfResult || !pdfResult.dataUri) {
        alert((UI._lpLang || 'pt') === 'en' ? 'Error: The PDF was not generated correctly.' : 'Erro: O PDF não foi gerado corretamente.');
        return;
    }

    const { dataUri, fileName } = pdfResult;

    // 2. Mostrar Loading
    const sendingMsg = document.createElement('div');
    sendingMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold flex items-center gap-2';
    sendingMsg.innerHTML = `<span class="animate-spin">🚀</span> ${(UI._lpLang || 'pt') === 'en' ? 'Sending Report...' : 'Enviando Relatório...'}`;
    document.body.appendChild(sendingMsg);

    // 3. Preparar Dados Estruturados (Restaurado)
    const boardName = this.state.availableBoards?.find(b => b.id === this.state.boardId)?.name || ((UI._lpLang || 'pt') === 'en' ? 'Trello Board' : 'Quadro Trello');
    const timestamp = new Date().toISOString();

    // Dados Gerais (Acumulado)
    const dadosGeral = this.state.kpis.geral.consultores.map(c => ({
        nome: c.nome,
        leads: c.leads,
        comentarios: c.comentarios,
        listas: c.listCounts
    }));

    // Dados Semanais (ou período selecionado)
    const dadosPeriodo = this.state.kpis.semanal.consultores.map(c => ({
        nome: c.nome,
        leads: c.leads,
        comentarios: c.comentarios,
        listas: c.listCounts
    }));

    // 4. Construir Payload Completo (Dados + Arquivo)
    const payload = {
        meta: {
            boardName: boardName,
            timestamp: timestamp,
            user: this.state.currentUser?.fullName || ((UI._lpLang || 'pt') === 'en' ? 'Unknown' : 'Desconhecido'),
            startDate: this.state.startDate || ((UI._lpLang || 'pt') === 'en' ? 'Start' : 'Início'),
            endDate: this.state.endDate || ((UI._lpLang || 'pt') === 'en' ? 'Now' : 'Agora'),
            message: (UI._lpLang || 'pt') === 'en' ? 'Attached is the performance report PDF and structured JSON data.' : 'Segue em anexo o relatório de performance PDF e os dados estruturados JSON.'
        },
        // Dados brutos de KPIs (Útil para automações que leem números)
        data: {
            geral: dadosGeral,
            periodo: dadosPeriodo,
            totais: {
                leadsGeral: this.state.kpis.geral.totalLeads,
                leadsPeriodo: this.state.kpis.semanal.totalLeads
            }
        },
        // Arquivo PDF codificado
        file: {
            name: fileName,
            contentType: 'application/pdf',
            content: dataUri // Base64 string "data:application/pdf;base64,..."
        }
    };

    // 5. Enviar Request
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        document.body.removeChild(sendingMsg);

        if (response.ok) {
            alert(`✅ ${(UI._lpLang || 'pt') === 'en' ? 'Report sent successfully!' : 'Relatório enviado com sucesso!'}\n(PDF e Dados JSON enviados para o Webhook)`);
        } else {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

    } catch (error) {
        console.error('Erro ao enviar Webhook:', error);
        if (sendingMsg && sendingMsg.parentNode) document.body.removeChild(sendingMsg);
        alert(`❌ ${(UI._lpLang || 'pt') === 'en' ? 'Failed to send report. Check if the Webhook accepts the payload size (PDF).' : 'Falha ao enviar relatório. Verifique se o Webhook aceita o tamanho do payload (PDF).'}\n\nErro: ` + error.message);
    }
};

