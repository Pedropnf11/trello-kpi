// ========================================
// MANAGER DASHBOARD (Gestor)
// ========================================
UI.renderManagerDashboard = function (state) {
    const kpis = state.kpis;
    const filterId = state.selectedMemberId;
    const listsDef = kpis.listsDef;
    const rawData = state.rawData;

    // 1. Filtrar KPIs
    const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
    const dadosPeriodo = KPILogic.filtrarDados(kpis.semanal, filterId);
    const temposListas = KPILogic.calcularTemposListas(rawData.cards, rawData.listas, state.startDate, state.endDate);

    // 2. Funil & Action Items
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
    let periodoTitulo = 'Performance da Semana';
    if (state.startDate || state.endDate) {
        periodoTitulo = 'Performance do Período Selecionado';
    }

    // LAYOUT DARK PREMIUM - SMART GRID
    return `
        <div class="flex h-screen w-full bg-[#0f172a] font-sans text-gray-100 overflow-hidden selection:bg-blue-500 selection:text-white relative">
            <!-- SIDEBAR -->
            ${UI.renderSidebarManager(state, kpis, filterId)}

            <!-- MAIN CONTENT AREA -->
            <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0f172a] min-w-0">
                <!-- Top Glass Bar -->
                <header class="h-16 bg-[#0f172a]/95 border-b border-gray-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
                    <div>
                        <h1 class="text-xl font-black text-white tracking-tight flex items-center gap-2">
                           <!-- HAMBURGER BUTTON (Mobile Only) -->
                           <button class="md:hidden p-2 text-gray-400 hover:text-white mr-2" onclick="document.getElementById('managerSidebar').classList.remove('-translate-x-full'); document.getElementById('managerSidebarOverlay').classList.remove('hidden');">
                               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                           </button>

                           <span class="hidden md:inline">Dashboard Gestor</span>
                           <span class="text-xs font-normal text-blue-400 bg-blue-500/10 px-2 py-1 rounded hidden md:inline">Manager</span>
                        </h1>
                    </div>
                    
                        <div class="flex items-center gap-2 md:gap-3">
                        <button id="atualizarBtn" class="p-2 rounded-lg text-gray-400 hover:text-white transition-all" title="Atualizar Dados">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        </button>
                        
                        <!-- BOTÃO GRÁFICOS -->
                        <button id="goToGraphsBtn" class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all border border-blue-400/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                            <span class="hidden md:inline">Analytics</span>
                        </button>

                          <div class="relative group z-50">
                            <button class="bg-[#111827] border border-white/[0.06] text-gray-200 px-3 py-2 rounded-lg hover:bg-[#1a2235] text-sm font-bold flex items-center gap-2 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                <span class="hidden md:inline">Exportar</span>
                            </button>
                            <!-- Dropdown com ponte invisível (pt-2) para não fechar no hover -->
                            <div class="absolute right-0 top-full w-56 pt-2 hidden group-hover:block">
                                <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-gray-700 p-1">
                                    <button id="exportarPdfBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">PDF</button>
                                    <button id="exportarBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">CSV</button>
                                    <button id="enviarWebhookBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">Exportar e enviar com email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Scrollable Content - FULL WIDTH SEM TRAVAS -->
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

                        <!-- ROW 2: TEMPO & ATIVIDADE (2 COLUNAS GRANDES LADO AO LADO) -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            
                            <!-- Tempo Médio -->
                            <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.07] transition-colors duration-200 flex flex-col">
                                ${UI.renderTimeTracking(temposListas, rawData.listas, state.timeTrackingLists)}
                            </div>

                            <!-- Atividade -->
                            <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.07] transition-colors duration-200 flex flex-col">
                                ${UI.renderActivity(kpis.atividade)}
                            </div>
                        </div>

                        <!-- ROW 3: FOLLOW-UPS -->
                        <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.07] transition-colors duration-200">
                            ${UI.renderDueDatesTable(dadosPeriodo)}
                        </div>

                        <!-- ROW 4: TABELAS DE PERFORMANCE -->
                        <div class="flex flex-col gap-5">
                            <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] overflow-x-auto hover:border-white/[0.07] transition-colors duration-200">
                                ${UI.renderTable(periodoTitulo, dadosPeriodo, listsDef, 'blue')}
                            </div>
                            <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] overflow-x-auto hover:border-white/[0.07] transition-colors duration-200">
                                ${UI.renderTable('Performance Geral (Acumulado Total)', dadosGeral, listsDef, 'gray')}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <!-- CHAT MODAL REMOVED -->
        </div>
    `;
};



// UI.renderFunnel, UI.renderActionItems, UI.renderActivity defined below
UI.renderFunnel = function (funilData) {
    if (!funilData || funilData.length === 0) return '';
    const maxCount = Math.max(...funilData.map(s => s.count));

    return `
        <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.07] transition-colors h-full flex flex-col w-full">
            <div class="flex justify-between items-center mb-5 flex-shrink-0">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-4 rounded-full bg-blue-500"></span>
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">PIPELINE</p>
                </div>
                <button id="resetHiddenListsBtn" class="text-[10px] font-bold text-blue-500/70 hover:text-blue-400 uppercase tracking-wider transition-colors">Restaurar</button>
            </div>
            <div class="flex-1 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar-dark pr-1">
                ${funilData.map((step) => {
        const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
        return `
                        <div class="w-full group flex-shrink-0">
                            <div class="flex justify-between items-center mb-1.5">
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-hover:text-gray-200 transition-colors">
                                     ${step.stage}
                                     <button class="remove-funnel-list-btn w-4 h-4 flex items-center justify-center rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px]" data-id="${step.id}">✕</button>
                                </span>
                                <span class="text-[13px] font-bold text-white tabular-nums">${step.count}</span>
                            </div>
                            <div class="h-2 w-full bg-[#1a2235] rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-700" style="width: ${Math.max(widthPercent, 1)}%; background: linear-gradient(90deg, #1d4ed8, #3b82f6)"></div>
                            </div>
                            <div class="text-right mt-0.5"><span class="text-[9px] text-gray-600 font-semibold">${step.conversionRate}</span></div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
};
UI.renderActionItems = function (actions) {
    if (!actions) return '';

    return `
        <div class="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] hover:border-white/[0.07] transition-colors h-full flex flex-col w-full" id="focusZoneCard">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-5 gap-3 cursor-pointer xl:cursor-default" onclick="if(window.innerWidth < 1280) { document.getElementById('actionItemsList').classList.toggle('hidden'); document.getElementById('focusZoneArrow').classList.toggle('rotate-180'); }">
                 <div class="flex items-center justify-between w-full xl:w-auto">
                     <div class="flex items-center gap-2.5">
                         <span class="w-1.5 h-4 rounded-full bg-rose-500 flex-shrink-0"></span>
                         <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">FOCUS ZONE</p>
                         <span class="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">${actions.length}</span>
                     </div>
                     <!-- MOBILE TOGGLE ARROW -->
                     <svg id="focusZoneArrow" class="w-5 h-5 text-gray-500 transform transition-transform xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                 </div>

                 <div class="flex bg-[#1a2235] rounded-lg p-1 gap-0.5 xl:flex hidden" id="focusZoneFilters">
                    <button class="action-filter-btn px-3 py-1 rounded-md text-[10px] font-bold bg-white/90 text-gray-800 shadow" data-filter="all">ALL</button>
                    <button class="action-filter-btn px-3 py-1 rounded-md text-[10px] font-bold text-gray-500 hover:text-rose-400 transition-colors" data-filter="critical">90d</button>
                    <button class="action-filter-btn px-3 py-1 rounded-md text-[10px] font-bold text-gray-500 hover:text-orange-400 transition-colors" data-filter="high">30d</button>
                 </div>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar-dark space-y-2" id="actionItemsList">
                ${actions.map(item => {
        const borderClass = item.priority === 'critical' ? 'border-rose-600/70' : (item.priority === 'high' ? 'border-orange-500/70' : 'border-yellow-500/70');
        const label = item.priority === 'critical' ? 'CRÍTICO' : (item.priority === 'high' ? 'URGENTE' : 'ATENÇÃO');
        const labelColor = item.priority === 'critical' ? 'text-rose-500' : (item.priority === 'high' ? 'text-orange-400' : 'text-yellow-400');
        const labelBg = item.priority === 'critical' ? 'bg-rose-500/8' : (item.priority === 'high' ? 'bg-orange-500/8' : 'bg-yellow-500/8');
        return `
                        <div class="action-item relative ${labelBg} p-3.5 rounded-xl border-l-4 ${borderClass} border-t border-r border-b border-white/[0.03] hover:border-white/[0.06] transition-colors group" data-priority="${item.priority}">
                             <div class="flex justify-between items-center mb-1">
                                <span class="text-[9px] font-bold ${labelColor} uppercase tracking-wider">${label}</span>
                                <span class="text-[9px] font-bold text-gray-600 uppercase truncate max-w-[100px]">${item.list}</span>
                             </div>
                             <h4 class="font-bold text-gray-200 text-[13px] mb-0.5 line-clamp-1" title="${item.card}">${item.card}</h4>
                             <p class="text-[11px] text-gray-500 truncate">${item.action}</p>
                             ${item.url ? `<a href="${item.url}" target="_blank" class="absolute inset-0 z-10"></a>` : ''}
                        </div>
                    `;
    }).join('')}
                ${actions.length === 0 ? '<div class="text-center text-gray-600 pt-10 text-[12px] font-medium">Tudo limpo! ✓</div>' : ''}
            </div>
        </div>
    `;
};

