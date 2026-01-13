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
                        <div class="h-6 w-px bg-gray-800 mx-2"></div>
                        <button id="toggleChatBtn" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 active:translate-y-0.5 transition-all">
                             <span>🤖</span> Mentor IA
                        </button>
                          <div class="relative group z-50 ml-2">
                            <button class="bg-[#1e293b] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold flex items-center gap-2">
                                <span>📥</span>
                            </button>
                            <!-- Dropdown com ponte invisível (pt-2) para não fechar no hover -->
                            <div class="absolute right-0 top-full w-56 pt-2 hidden group-hover:block">
                                <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-gray-700 p-1">
                                    <button id="exportarPdfBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">📄 PDF Relatório</button>
                                    <button id="exportarBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">📊 CSV Dados</button>
                                    <button id="enviarWebhookBtn" class="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm font-bold text-gray-300 rounded-lg transition-colors flex items-center gap-2">🔗 Webhook</button>
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
                                <div class="mb-6">
                                    <h2 class="text-xl font-bold text-white">Tempo médio de espera</h2>
                                    <p class="text-xs text-gray-500 font-medium">Análise de performance</p>
                                </div>
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
                             <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 w-full overflow-hidden">
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

            <!-- CHAT MODAL -->
            <div id="chatModal" class="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 hidden flex flex-col overflow-hidden z-[60]" style="height: 500px;">
                <div class="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🤖</span>
                        <h3 class="font-bold">Mentor IA</h3>
                    </div>
                    <button id="closeChatBtn" class="hover:bg-blue-700 p-1 rounded transition">✕</button>
                </div>
                <div id="chatMessages" class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"></div>
                 <div class="p-4 bg-white border-t flex gap-2">
                    <input type="text" id="chatInput" placeholder="Pergunta..." class="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500">
                    <button id="sendChatBtn" class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    </button>
                </div>
            </div>
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
        // Definir cores baseadas no card (azul ou laranja/padrão)
        const isBlue = htmlId.includes('Left');
        const bgHeader = isBlue ? 'bg-blue-600' : 'bg-orange-500';
        const textColor = isBlue ? 'text-blue-500' : 'text-orange-500';

        return `
            <div class="bg-[#0f172a] rounded-xl p-6 border border-gray-800 w-full relative group">
                 <div class="flex justify-between items-start mb-4 w-full relative z-20">
                     <div class="w-full flex items-center gap-2">
                        <select id="${htmlId}" class="w-full bg-transparent text-sm font-bold text-gray-200 border-none p-0 focus:ring-0 cursor-pointer hover:text-white uppercase tracking-wider appearance-none z-10 transition-colors">
                            ${allLists.map(l => `<option class="bg-gray-900 text-gray-300" value="${l.id}" ${l.id === id ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                        <svg class="w-4 h-4 text-gray-500 pointer-events-none absolute right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </div>
                     <span class="bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2">${item.count || 0} cards</span>
                </div>

                <div class="${bgHeader} rounded-xl p-4 mb-4 text-center shadow-lg">
                    <div class="text-[10px] font-bold text-white/80 uppercase mb-1 flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Tempo Médio
                    </div>
                     <span class="text-3xl font-black text-white block">${item.tempoMedio || '-'}</span>
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
    return UI.renderSidebar.original ? UI.renderSidebar.original(state, kpis, filterId) : `
        <aside class="w-[260px] bg-[#0b0f19] text-gray-400 flex-shrink-0 flex flex-col h-full z-40 border-r border-gray-800">
            <div class="h-16 flex items-center px-5 border-b border-gray-800">
               <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-3">K</div>
               <span class="font-bold text-white tracking-wide">KPI Master</span>
            </div>

            <div class="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar-dark">
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

                <div>
                    <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">Período</label>
                    <div class="bg-gray-900 rounded-lg p-3 border border-gray-800 space-y-2">
                        <input type="date" id="startDate" value="${state.startDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        <input type="date" id="endDate" value="${state.endDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        ${(state.startDate || state.endDate) ? `<button id="clearDates" class="w-full text-xs text-red-500 py-1 hover:text-red-400">Limpar</button>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="p-4 border-t border-gray-800">
                 <button id="configBtn" class="w-full py-2 text-sm text-gray-500 hover:text-white">Logout</button>
            </div>
        </aside>
    `;
};
UI.renderFunnel = function (funilData) {
    if (!funilData || funilData.length === 0) return '';
    const maxCount = Math.max(...funilData.map(s => s.count));

    return `
        <div class="bg-[#1e293b] rounded-2xl p-8 shadow-xl border border-gray-800 h-full flex flex-col w-full">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-white">Pipeline</h2>
                <button id="resetHiddenListsBtn" class="text-xs font-bold text-blue-500 hover:text-blue-400">Restaurar</button>
            </div>
            <div class="flex-1 flex flex-col justify-center gap-4">
                ${funilData.map((step) => {
        const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
        return `
                        <div class="w-full group">
                            <div class="flex justify-between mb-1">
                                <span class="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                                     ${step.stage} <button class="remove-funnel-list-btn text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition" data-id="${step.id}">×</button>
                                </span>
                                <span class="text-white font-bold">${step.count}</span>
                            </div>
                            <div class="h-6 w-full bg-gray-900 rounded-md overflow-hidden relative">
                                <div class="h-full rounded-md transition-all duration-1000" style="width: ${Math.max(widthPercent, 1)}%; background-color: ${step.color}"></div>
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
                    <button class="action-filter-btn px-3 py-1 rounded text-[10px] font-bold text-gray-500 hover:text-purple-400" data-filter="critical">90d</button>
                    <button class="action-filter-btn px-3 py-1 rounded text-[10px] font-bold text-gray-500 hover:text-red-400" data-filter="high">30d</button>
                 </div>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar-dark space-y-3" id="actionItemsList">
                ${actions.map(item => {
        let borderClass = item.priority === 'critical' ? 'border-purple-500' : (item.priority === 'high' ? 'border-red-500' : 'border-yellow-500');
        let label = item.priority === 'critical' ? 'CRÍTICO' : (item.priority === 'high' ? 'URGENTE' : 'ATENÇÃO');
        let labelColor = item.priority === 'critical' ? 'text-purple-400' : (item.priority === 'high' ? 'text-red-400' : 'text-yellow-400');
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
                <div class="border border-yellow-900/30 bg-yellow-900/10 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm font-bold text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                            Menos Ativo
                        </h3>
                        ${atividade.maisInativo ? `
                            <div class="text-2xl font-black text-white mb-1">
                                ${atividade.maisInativo.nome}
                            </div>
                             <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-bold text-yellow-600">
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
