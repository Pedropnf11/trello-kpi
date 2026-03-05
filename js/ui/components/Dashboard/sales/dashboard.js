
// ========================================
// SALES DASHBOARD (Vendedor)
// ========================================
UI.renderSalesDashboard = function (state) {
    const kpis = state.kpis;
    const filterId = state.selectedMemberId;
    const listsDef = kpis.listsDef;
    const rawData = state.rawData;
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;

    // 1. Filtrar KPIs (sempre filtrado para o vendedor)
    const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
    const dadosPeriodo = KPILogic.filtrarDados(kpis.semanal, filterId);
    const temposListas = KPILogic.calcularTemposListas(rawData.cards, rawData.listas, state.startDate, state.endDate);

    // 2. Funil & Action Items (filtrados)
    let funnelData = [];
    let listCounts = kpis.geral.listCounts;
    if (filterId && rawData) {
        const memberData = kpis.geral.consultores.find(c => c.id === filterId);
        if (memberData) listCounts = memberData.listCounts;
    }
    if (rawData) funnelData = KPILogic.calcularFunilTodasListas(rawData.listas, listCounts, state.hiddenFunnelLists);

    let actionItems = [];
    if (rawData) actionItems = KPILogic.gerarActionItems(rawData.cards, rawData.listas, rawData.membros, filterId);

    // Título da Tabela de Período
    let periodoTitulo = t('A Minha Performance desta Semana', 'My Performance This Week');
    if (state.startDate || state.endDate) {
        periodoTitulo = t('A Minha Performance do Período', 'My Performance for This Period');
    }

    // LAYOUT IDÊNTICO AO MANAGER MAS COM TEXTOS PERSONALIZADOS
    return `
        <div class="flex h-screen w-full bg-[#0f172a] font-sans text-gray-100 overflow-hidden selection:bg-blue-500 selection:text-white relative">
            <!-- SIDEBAR SALES (sem filtro de equipa) -->
            ${UI.renderSidebarSales(state, kpis, filterId)}

            <!-- MAIN CONTENT AREA -->
            <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0f172a] min-w-0">
                <!-- Top Glass Bar -->
                <header class="h-16 bg-[#0f172a]/95 border-b border-gray-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
                    <div>
                        <h1 class="text-xl font-black text-white tracking-tight flex items-center gap-2">
                           <!-- HAMBURGER BUTTON (Mobile Only) -->
                           <button class="md:hidden p-2 text-gray-400 hover:text-white mr-2" onclick="document.getElementById('salesSidebar').classList.remove('-translate-x-full'); document.getElementById('sidebarOverlay').classList.remove('hidden');">
                               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                           </button>

                           <span class="hidden md:inline">${t('O Meu Dashboard', 'My Dashboard')}</span>
                           <span class="text-xs font-normal text-green-400 bg-green-500/10 px-2 py-1 rounded hidden md:inline">${t('Vendedor', 'Agent')}</span>
                        </h1>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <button id="atualizarBtn" class="p-2 rounded-lg text-gray-400 hover:text-white transition-all" title="${t('Atualizar Dados', 'Refresh Data')}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        </button>
                        
                          <div class="relative group z-50 ml-2">
                            <button class="bg-[#1e293b] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                <span class="hidden md:inline">${t('Exportar', 'Export')}</span>
                            </button>
                            <div class="absolute right-0 top-full w-56 pt-2 hidden group-hover:block">
                                <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-gray-700 p-1">
                                    <button id="exportarPdfBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">PDF</button>
                                    <button id="exportarBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">CSV</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar-dark scroll-smooth relative w-full">
                    <div class="w-full flex flex-col gap-6 pb-20">
                    
                        <!-- ROW 1: PIPELINE + ACTIONS -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full lg:h-[600px]">
                            <div class="lg:col-span-8 flex flex-col h-full overflow-hidden" id="section-pipeline">
                                ${UI.renderFunnel(funnelData)}
                            </div>
                            <div class="lg:col-span-4 flex flex-col h-full overflow-hidden" id="section-actions">
                                 ${UI.renderActionItems(actionItems)}
                            </div>
                        </div>

                        <!-- ROW 2: TEMPO (FULL WIDTH) -->
                        <div class="grid grid-cols-1 gap-6 w-full">
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex flex-col h-full">
                                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 flex-1">
                                     ${UI.renderTimeTracking(temposListas, rawData.listas, state.timeTrackingLists)}
                                </div>
                            </div>
                        </div>

                        <!-- ROW 3: FOLLOW-UPS -->
                        <div class="grid grid-cols-1 gap-6 w-full">
                             <div class="bg-[#1e293b] rounded-2xl p-6 w-full overflow-hidden">
                                 ${UI.renderDueDatesTable(dadosPeriodo)}
                            </div>
                        </div>

                         <!-- ROW 4: TABELAS DE PERFORMANCE PESSOAL -->
                        <div class="grid grid-cols-1 gap-6 w-full mt-4">
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 w-full overflow-x-auto">
                                ${UI.renderTable(periodoTitulo, dadosPeriodo, listsDef, 'blue')}
                            </div>
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 w-full overflow-x-auto">
                                ${UI.renderTable(t('A Minha Performance Geral', 'My Overall Performance'), dadosGeral, listsDef, 'gray')}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    `;
};


