UI.renderDashboard = function (state) {
    const kpis = state.kpis;
    const filterId = state.selectedMemberId;
    const listsDef = kpis.listsDef;

    const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
    const dadosSemanal = KPILogic.filtrarDados(kpis.semanal, filterId);
    const temposListas = kpis.temposListas || { leads: {}, naoAtendeu: {} };

    return `
        <div class="space-y-6">
            <!-- Header -->
            ${UI.renderHeader(state, kpis, filterId)}

            <!-- Tempo de Permanência -->
            ${UI.renderTimeTracking(temposListas)}

            <!-- Atividade dos Usuários -->
            ${UI.renderActivity(kpis.atividade)}

            <!-- Tabela de DUEs -->
            ${UI.renderDueDatesTable(dadosSemanal)}

            <!-- Tabelas de KPIs -->
            ${UI.renderTable('Dados de Leads Esta Semana', dadosSemanal, listsDef, '')}
            ${UI.renderTable('Dados de Leads Gerais', dadosGeral, listsDef, '')}
        </div>
    `;
};

UI.renderHeader = function (state, kpis, filterId) {
    return `
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Trello KPI</h1>
                <p class="text-gray-500 mt-1 font-light">Dashboard de Performance</p>
            </div>
            <div class="flex gap-3 items-center">
                <div class="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-1.5">
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Início</label>
                        <input type="date" id="startDate" value="${state.startDate || ''}" 
                            class="bg-transparent text-gray-700 focus:outline-none font-semibold text-sm w-28">
                    </div>
                    <div class="w-px h-8 bg-gray-200"></div>
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Fim</label>
                        <input type="date" id="endDate" value="${state.endDate || ''}" 
                            class="bg-transparent text-gray-700 focus:outline-none font-semibold text-sm w-28">
                    </div>
                    ${(!state.startDate && !state.endDate) ?
            '<span class="text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full ml-1">Auto (7 dias)</span>' :
            '<button id="clearDates" class="text-xs text-red-500 hover:text-red-700 ml-1 font-bold">✕</button>'}
                </div>

                <select id="memberFilter" class="bg-white border-2 border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium">
                    <option value="">Todos os Membros</option>
                    ${kpis.geral.consultores.map(c => `
                        <option value="${c.id}" ${c.id === filterId ? 'selected' : ''}>
                            ${c.nome}
                        </option>
                    `).join('')}
                </select>
                <button id="atualizarBtn" class="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 shadow-sm transition font-medium">
                        Atualizar
                </button>
                <button id="exportarBtn" class="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 shadow-sm transition font-medium">
                    Exportar CSV
                </button>
                <button id="exportarPdfBtn" class="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-sm transition font-medium">
                    Exportar PDF
                </button>
                <button id="importarBtn" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition font-medium">
                    Importar CSV
                </button>
                <input type="file" id="csvInput" accept=".csv" class="hidden">
                <button id="enviarWebhookBtn" class="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 shadow-sm transition font-medium">
                    Enviar Webhook
                </button>
                <button id="toggleChatBtn" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition font-medium flex items-center gap-2">
                        <span>🤖</span> Mentor IA
                </button>
                <button id="configBtn" class="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 shadow-sm transition font-medium">
                    ⚙️
                </button>
            </div>
        </div>
    `;
};
