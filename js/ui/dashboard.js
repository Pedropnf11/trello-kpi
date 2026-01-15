UI.renderDashboard = function (state) {
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
            ${UI.renderSidebar(state, kpis, filterId)}

            <!-- MAIN CONTENT AREA -->
            <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0f172a] min-w-0">
                <!-- Top Glass Bar -->
                <header class="h-16 bg-[#0f172a]/95 border-b border-gray-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
                    <div>
                        <h1 class="text-xl font-black text-white tracking-tight flex items-center gap-2">
                           Dashboard
                        </h1>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <button id="atualizarBtn" class="p-2 rounded-lg text-gray-400 hover:text-white transition-all" title="Atualizar Dados">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        </button>
                        
                          <div class="relative group z-50 ml-2">
                            <button class="bg-[#1e293b] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold flex items-center gap-2">
                                <span>Exportar</span>
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
                            
                            <!-- Wrapper Tempo Médio -->
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex flex-col h-full">
                               
                                <div class="grid grid-cols-1 md:grid-cols-1 gap-1 flex-1">
                                     ${UI.renderTimeTracking(temposListas, rawData.listas, state.timeTrackingLists)}
                                </div>
                            </div>
                            
                            <!-- Wrapper Atividade -->
                            <div class="h-full">
                                ${UI.renderActivity(kpis.atividade)}
                            </div>
                        </div>

                        <!-- ROW 3: FOLLOW-UPS (Agora tem largura total) -->
                        <div class="grid grid-cols-1 gap-6 w-full">
                             <div class="bg-[#1e293b] rounded-2xl p-6 w-full overflow-hidden">
                                 ${UI.renderDueDatesTable(dadosPeriodo)}
                            </div>
                        </div>

                         <!-- ROW 4: TABELAS DE PERFORMANCE -->
                        <div class="grid grid-cols-1 gap-6 w-full mt-4">
                            <!-- Tabela do Período -->
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 w-full overflow-x-auto">
                                ${UI.renderTable(periodoTitulo, dadosPeriodo, listsDef, 'blue')}
                            </div>
                            
                            <!-- Tabela Geral -->
                            <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 w-full overflow-x-auto">
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

UI.renderTimeTracking = function (temposListas, allLists, selectedConfig) {
    const listIds = Object.keys(temposListas);
    if (!listIds.length) return '';
    let leftId = selectedConfig?.left || (listIds.find(id => temposListas[id].nome.toLowerCase().includes('lead')) || listIds[0]);
    let rightId = selectedConfig?.right || (listIds.find(id => temposListas[id].nome.toLowerCase().includes('nao atendeu')) || listIds[1]);

    const card = (id, htmlId, colorClass) => {
        const item = temposListas[id] || {};
        // Definir cores: Esquerda (Verde), Direita (Vermelho)
        const isLeft = htmlId.includes('Left');
        const bgHeader = isLeft ? 'bg-emerald-600' : 'bg-red-600';

        return `
            <div class="bg-[#0f172a] rounded-xl p-6 border border-gray-800 w-full relative group shadow-sm">
                 <div class="flex justify-between items-start mb-6 w-full relative z-20">
                     <div class="w-full flex items-center gap-2 border-b border-gray-800 pb-2">
                        <select id="${htmlId}" class="w-full bg-transparent text-sm font-bold text-gray-200 border-none p-0 focus:ring-0 cursor-pointer hover:text-white uppercase tracking-wider appearance-none z-10 transition-colors">
                            ${allLists.map(l => `<option class="bg-gray-900 text-gray-300" value="${l.id}" ${l.id === id ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                        <svg class="w-4 h-4 text-gray-500 pointer-events-none absolute right-0 top-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </div>
                     <span class="bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 mt-0.5">${item.count || 0} cards</span>
                </div>

                <!-- Header sem bordas, apenas cor sólida vibrante -->
                <div class="${bgHeader} rounded-2xl p-6 mb-6 text-center shadow-lg transform transition hover:scale-[1.02] duration-300">
                    <div class="text-[10px] font-bold text-white/90 uppercase mb-1 flex items-center justify-center gap-2 opacity-80">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Tempo Médio
                    </div>
                     <span class="text-4xl font-black text-white block tracking-tight shadow-sm">${item.tempoMedio || '-'}</span>
                </div>

                <div class="space-y-3">
                     <!-- Mais Rápido -->
                    <div class="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                        <div class="text-[9px] font-bold text-green-500 uppercase mb-1">Mais Rápido</div>
                        <div class="flex flex-col">
                             <span class="text-lg font-bold text-green-400 leading-tight">${item.maisRapido ? item.maisRapido.tempo : '-'}</span>
                              ${item.maisRapido ? `<span class="text-[10px] text-gray-500 truncate mt-1" title="${item.maisRapido.cardNome}">${item.maisRapido.cardNome}</span>` : ''}
                        </div>
                    </div>

                     <!-- Mais Lento -->
                    <div class="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                         <div class="text-[9px] font-bold text-red-500 uppercase mb-1">Mais Lento</div>
                        <div class="flex flex-col">
                             <span class="text-lg font-bold text-red-400 leading-tight">${item.maisLento ? item.maisLento.tempo : '-'}</span>
                             ${item.maisLento ? `<span class="text-[10px] text-gray-500 truncate mt-1" title="${item.maisLento.cardNome}">${item.maisLento.cardNome}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    return `
        ${card(leftId, 'timeTrackingSelectLeft')}
        ${card(rightId, 'timeTrackingSelectRight')}
    `;
};

// ... Resto das funções mantidas ...
UI.renderSidebar = function (state, kpis, filterId) {
    const isSales = state.userRole === 'sales';
    const currentUser = state.currentUser || { fullName: 'Vendedor', username: 'Me' };

    return `
        <aside class="w-[260px] bg-[#0b0f19] text-gray-400 flex-shrink-0 flex flex-col h-full z-40 border-r border-gray-800">
            <div class="h-16 flex items-center px-5 border-b border-gray-800">
               <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-3">K</div>
               <span class="font-bold text-white tracking-wide">KPI Master</span>
            </div>

            <div class="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar-dark">
                
                <!-- 1. PERFIL (COMUM) -->
                <div>
                    <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">O Meu Perfil</label>
                     <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            ${currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : 'ME'}
                        </div>
                        <div class="overflow-hidden">
                            <div class="text-sm font-bold text-white truncate" title="${currentUser.fullName}">${currentUser.fullName}</div>
                            <div class="text-[10px] text-green-500 font-bold uppercase">Conectado</div>
                        </div>
                     </div>
                </div>

                <!-- 2. PERIODO (COMUM) -->
                <div>
                    <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">Período</label>
                    <div class="bg-gray-900 rounded-lg p-3 border border-gray-800 space-y-2">
                        <input type="date" id="startDate" value="${state.startDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        <input type="date" id="endDate" value="${state.endDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        ${(state.startDate || state.endDate) ? `<button id="clearDates" class="w-full text-xs text-red-500 py-1 hover:text-red-400">Limpar</button>` : ''}
                    </div>
                </div>

                <!-- 3. EQUIPA (APENAS GESTOR) -->
                ${!isSales ? `
                <div>
                     <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">Equipa</label>
                     <div class="space-y-1">
                        <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${!filterId ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}"
                             onclick="document.getElementById('memberFilter').value=''; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                            <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold">ALL</div>
                            <span class="text-sm font-medium">Todos</span>
                        </button>
                        ${kpis.geral.consultores.map(c => `
                            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${c.id === filterId ? 'bg-gray-800 text-white border border-gray-700' : 'hover:bg-gray-800 hover:text-white'}"
                                 onclick="document.getElementById('memberFilter').value='${c.id}'; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                                 <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold uppercase">${c.nome.substring(0, 2)}</div>
                                <span class="text-sm font-medium truncate">${c.nome}</span>
                            </button>
                        `).join('')}
                     </div>
                     <select id="memberFilter" class="hidden"><option value="">Todos</option>${kpis.geral.consultores.map(c => `<option value="${c.id}" ${c.id === filterId ? 'selected' : ''}>${c.nome}</option>`).join('')}</select>
                </div>
                ` : ''}

            </div>
            
            <div class="p-4 border-t border-gray-800 flex flex-col gap-3">
                <button id="docsBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-green-900/10 active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Documentos de Ajuda</span>
                </button>
                 <button id="tutorialBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-blue-900/10 active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <span>Tutorial</span>
                </button>
                <button id="settingsBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800 transition-all duration-300 font-bold text-sm shadow-sm active:scale-95" title="Configurações">
                    <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>Configurações</span>
                </button>
                 <button id="configBtn" class="group w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-red-900/10 active:scale-95" title="Terminar Sessão">
                    <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Sair</span>
                </button>
            </div>
        </aside>

        <!-- DOCS MODAL -->
        <div id="docsModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-fadeIn">
                 <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b border-gray-700 bg-[#0f172a]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center text-green-500">
                             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                             <h2 class="text-xl font-bold text-white">Documentos de Ajuda</h2>
                             <p class="text-xs text-gray-400">Recursos e guiões para a equipa.</p>
                        </div>
                    </div>
                    <button id="closeDocsBtn" class="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-700 bg-[#1e293b] px-6 gap-6">
                    <button class="docs-tab-btn py-4 text-sm font-bold text-green-500 border-b-2 border-green-500 hover:text-green-400 transition-colors" data-tab="vendas">
                        Vendas & Scripts
                    </button>
                    <button class="docs-tab-btn py-4 text-sm font-bold text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="processos">
                        Processos Internos
                    </button>
                    <button class="docs-tab-btn py-4 text-sm font-bold text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="templates">
                        Templates de Mensagem
                    </button>
                </div>

                <!-- Content Area -->
                <div class="flex-1 overflow-hidden flex bg-[#0f172a]">
                    <!-- Sidebar List (Mock Files) -->
                    <div class="w-1/3 border-r border-gray-800 overflow-y-auto p-4 space-y-2">
                        <!-- Content for Vendas -->
                        <div id="docs-list-vendas" class="docs-list-content space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">Guiões de Venda</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group" 
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Vendas_Scripts/GUIAO para 1 contacto.pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    GUIAO para 1 contacto.pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">Atualizado há 2 dias • 2.4 MB</div>
                            </button>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group"
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Guião  para leads antigas  (1).pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                     <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Guião para leads antigas
                                </div>
                            </button>
                        </div>

                         <!-- Content for Processos -->
                        <div id="docs-list-processos" class="docs-list-content hidden space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">Onboarding</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Manual de Boas Vindas.pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">Versão 2024</div>
                            </button>
                        </div>
                        
                         <!-- Content for Templates -->
                        <div id="docs-list-templates" class="docs-list-content hidden space-y-2">
                             <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">SMS</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group"
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Templates_SMS/MODELOS COMPRA CASA (1).pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    MODELOS COMPRA CASA (1).pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">PDF • Templates SMS</div>
                            </button>
                        </div>
                    </div>

                    <!-- Preview Area (Right Side) -->
                    <div class="flex-1 bg-[#2e3b4e] flex flex-col relative">
                        <iframe id="doc-preview-frame" src="/js/docs/Vendas_Scripts/GUIAO para 1 contacto.pdf" class="w-full h-full border-none" title="Pré-visualização"></iframe>
                        
                         <!-- Empty State (Hidden by default now) -->
                        <div id="doc-preview-empty" class="hidden absolute inset-0 flex items-center justify-center bg-[#0b0f19]">
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </div>
                                <h3 class="text-xl font-bold text-gray-300">Selecione um documento</h3>
                                <p class="text-gray-500 max-w-xs mx-auto mt-2">Escolha um ficheiro à esquerda para visualizar.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- TUTORIAL MODAL -->
        <div id="tutorialModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[90vh]">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b border-gray-700 bg-[#0f172a]">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <span class="text-2xl">📚</span> Tutorial & Ajuda
                    </h2>
                    <button id="closeTutorialBtn" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-700 bg-[#1e293b]">
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-blue-500 border-b-2 border-blue-500 hover:bg-gray-800 transition-colors" data-tab="exportar">Exportação</button>
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="filtros">Filtros & Datas</button>
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="geral">Geral</button>
                </div>

                <!-- Content Area -->
                <div class="p-8 overflow-y-auto bg-[#1e293b] min-h-[300px]">
                    
                    <!-- TAB: EXPORTAR -->
                    <div id="tab-content-exportar" class="tab-content block animate-fadeIn">
                        <h3 class="text-lg font-bold text-white mb-4">Como Exportar?</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">
                            Para exportares os teus dados, deves clicar no botão <strong>"Exportar"</strong> localizado no topo superior direito da aplicação.
                        </p>
                        <ul class="list-disc pl-5 space-y-2 text-gray-400 mb-6">
                            <li><strong class="text-white">PDF:</strong> Gera um relatório visual completo, ideal para apresentações, ideal para apresentações</li>
                            <li><strong class="text-white">CSV:</strong> Baixa os dados brutos para Excel ou Google Sheets.</li>
                            <li><strong class="text-white">Email:</strong> Envia o relatório diretamente para a tua equipa.</li>
                        </ul>
                        <div class="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50">
                            <p class="text-sm text-blue-300">💡 Nota: Para enviar com email é preciso primeiro configurar o webhook no menu de configurações.</p>
                        </div>
                    </div>

                    <!-- TAB: WEBHOOK -->
                    <div id="tab-content-filtros" class="tab-content hidden animate-fadeIn">
                        <h3 class="text-lg font-bold text-white mb-4">Como criar um</h3>
                        <p class="text-gray-300 mb-4">
                            Podes personalizar a visualização utilizando a barra lateral esquerda.
                        </p>
                        <div class="space-y-4">
                            <div class="flex gap-4 items-start">
                                <div class="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-white flex-shrink-0">1</div>
                                <div>
                                    <h4 class="font-bold text-white"Passo 1 de como criar um Webhook</h4>
                                    <p class="text-sm text-gray-400">Primeiro tens de criar conta no Make.com ou zapier.com</p>
                                </div>
                            </div>
                            <div class="flex gap-4 items-start">
                                <div class="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-white flex-shrink-0">2</div>
                                <div>
                                    <h4 class="font-bold text-white">Passo 2</h4>
                                    <p class="text-sm text-gray-400">Cria a tua template com uma Webhook, cria conexções com o Gmail</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB: IA -->
                    <div id="tab-content-geral" class="tab-content hidden animate-fadeIn">
                        <h3 class="text-lg font-bold text-white mb-4">Ajuda IA</h3>
                        <p class="text-gray-300 mb-4">
                         Cada pessoa pode apenas usar a ajuda da IA apenas 1x por dia
                        </p>
                       
                    </div>

                </div>
            </div>
        </div>
    `;
};
UI.renderFunnel = function (funilData) {
    if (!funilData || funilData.length === 0) return '';
    const maxCount = Math.max(...funilData.map(s => s.count));

    return `
        <div class="bg-[#1e293b] rounded-2xl p-8 shadow-xl border border-gray-800 h-full flex flex-col w-full">
            <div class="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 class="text-xl font-bold text-white">Pipeline</h2>
                <button id="resetHiddenListsBtn" class="text-xs font-bold text-blue-500 hover:text-blue-400">Restaurar</button>
            </div>
            <div class="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar-dark pr-2">
                ${funilData.map((step) => {
        const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
        return `
                        <div class="w-full group flex-shrink-0">
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                                     ${step.stage} 
                                     <button class="remove-funnel-list-btn w-5 h-5 flex items-center justify-center rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all font-bold text-xs" data-id="${step.id}">✕</button>
                                </span>
                                <span class="text-white font-bold">${step.count}</span>
                            </div>
                            <div class="h-6 w-full bg-gray-900 rounded-md overflow-hidden relative shadow-inner border border-gray-800">
                                <div class="h-full rounded-md transition-all duration-1000 shadow-lg shadow-blue-500/30" style="width: ${Math.max(widthPercent, 1)}%; background-color: #2563eb"></div>
                            </div>
                            <div class="text-right mt-0.5"><span class="text-[10px] text-gray-500 font-bold">${step.conversionRate}</span></div>
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
        <div class="bg-[#1e293b] rounded-2xl p-6 shadow-xl border border-gray-800 h-full flex flex-col w-full">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-3">
                 <h2 class="text-xl font-bold text-white flex items-center gap-2">Focus Zone <span class="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded">${actions.length}</span></h2>
                 <div class="flex bg-gray-900 rounded-md p-1">
                    <button class="action-filter-btn px-3 py-1 rounded text-[10px] font-bold bg-white text-gray-800 shadow" data-filter="all">ALL</button>
                    <button class="action-filter-btn px-3 py-1 rounded text-[10px] font-bold text-gray-500 hover:text-rose-500" data-filter="critical">90d</button>
                    <button class="action-filter-btn px-3 py-1 rounded text-[10px] font-bold text-gray-500 hover:text-orange-500" data-filter="high">30d</button>
                 </div>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar-dark space-y-3" id="actionItemsList">
                ${actions.map(item => {
        let borderClass = item.priority === 'critical' ? 'border-rose-600' : (item.priority === 'high' ? 'border-orange-500' : 'border-yellow-500');
        let label = item.priority === 'critical' ? 'CRÍTICO' : (item.priority === 'high' ? 'URGENTE' : 'ATENÇÃO');
        let labelColor = item.priority === 'critical' ? 'text-rose-500' : (item.priority === 'high' ? 'text-orange-400' : 'text-yellow-400');
        return `
                        <div class="action-item relative bg-[#0f172a] p-4 rounded-xl border-l-4 ${borderClass} border-t border-r border-b border-gray-800 hover:border-r-gray-600 transition group" data-priority="${item.priority}">
                             <div class="flex justify-between mb-1">
                                <span class="text-[9px] font-bold ${labelColor}">${label}</span>
                                <span class="text-[9px] font-bold text-gray-500 uppercase">${item.list}</span>
                             </div>
                             <h4 class="font-bold text-gray-200 text-sm mb-1 line-clamp-1" title="${item.card}">${item.card}</h4>
                             <p class="text-xs text-gray-500 truncate">${item.action}</p>
                             ${item.url ? `<a href="${item.url}" target="_blank" class="absolute inset-0 z-10"></a>` : ''}
                        </div>
                    `;
    }).join('')}
                ${actions.length === 0 ? '<div class="text-center text-gray-500 pt-10">Tudo limpo!</div>' : ''}
            </div>
        </div>
    `;
};
UI.renderActivity = function (atividade) {
    if (!atividade) return '';
    return `
        <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 h-full flex flex-col shadow-xl">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                   Atividade dos utilizadores
                </h2>
                <p class="text-xs text-gray-500 font-medium">Última semana</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <!-- Mais Ativo -->
                <div class="border border-green-900/30 bg-green-900/10 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                           Mais Ativo
                        </h3>
                        ${atividade.maisAtivo ? `
                            <div class="text-2xl font-black text-white mb-1">
                                ${atividade.maisAtivo.nome}
                            </div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-bold text-green-500">
                                    ${atividade.maisAtivo.acoes}
                                </span>
                                <span class="text-xs text-gray-400 font-bold uppercase">ações</span>
                            </div>
                        ` : '<div class="text-sm text-gray-500 font-bold">Sem dados</div>'}
                    </div>
                </div>

                <!-- Mais Inativo -->
                <div class="border border-rose-900/30 bg-rose-900/10 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm font-bold text-rose-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                            Menos Ativo
                        </h3>
                        ${atividade.maisInativo ? `
                            <div class="text-2xl font-black text-white mb-1">
                                ${atividade.maisInativo.nome}
                            </div>
                             <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-bold text-rose-600">
                                    ${atividade.maisInativo.acoes}
                                </span>
                                <span class="text-xs text-gray-400 font-bold uppercase">ações</span>
                            </div>
                        ` : '<div class="text-sm text-gray-500 font-bold">Sem dados</div>'}
                    </div>
                </div>
            </div>
        </div>
    `;
};
UI.renderHeader = function () { return ''; };
