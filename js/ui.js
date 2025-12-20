// UI Rendering - Premium Minimalist Design
const UI = {
    renderConfig(state) {
        return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full border border-gray-100">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold text-gray-900 mb-2">Trello KPI</h1>
                        <p class="text-gray-500 font-light">Dashboard de Performance</p>
                    </div>

                    ${state.error ? `
                        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                            ${state.error}
                        </div>
                    ` : ''}

                    <div class="space-y-5 mb-8">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">API Key</label>
                            <input type="text" id="apiKey" value="${state.apiKey}" 
                                placeholder="Cole sua API Key"
                                class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Token</label>
                            <input type="text" id="token" value="${state.token}"
                                placeholder="Cole seu Token"
                                class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Board ID</label>
                            <input type="text" id="boardId" value="${state.boardId}"
                                placeholder="ID do board"
                                class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Webhook (Make.com)</label>
                            <input type="text" id="webhookUrl" value="${state.webhookUrl || ''}"
                                placeholder="https://hook.us1.make.com/..."
                                class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Groq API Key (Opcional - Para IA)</label>
                            <input type="text" id="groqApiKey" value="${state.groqApiKey || ''}"
                                placeholder="gsk_..."
                                class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                            <p class="text-[10px] text-gray-400 mt-1">Necessário para gerar sugestões automáticas.</p>
                        </div>
                    </div>

                    <button id="conectarBtn" ${state.loading ? 'disabled' : ''}
                        class="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 shadow-lg">
                        ${state.loading ? 'Conectando...' : 'Conectar'}
                    </button>

                    <div class="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 class="font-semibold text-gray-900 mb-3 text-sm">Como obter credenciais</h3>
                        <ol class="space-y-2 text-xs text-gray-600">
                            <li><strong>API Key:</strong> trello.com/power-ups/admin</li>
                            <li><strong>Token:</strong> Clique em "Generate a Token"</li>
                            <li><strong>Board ID:</strong> Copie da URL do board</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
    },

    renderDashboard(state) {
        const kpis = state.kpis;
        const filterId = state.selectedMemberId;
        const listsDef = kpis.listsDef;

        const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
        const dadosSemanal = KPILogic.filtrarDados(kpis.semanal, filterId);
        const temposListas = kpis.temposListas || { leads: {}, naoAtendeu: {} };

        const renderTabela = (titulo, dados, icon) => `
            <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div class="flex items-center gap-3 mb-6">
                   <span class="text-2xl">${icon}</span>
                   <h2 class="text-2xl font-bold text-gray-900">${titulo}</h2>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-8">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
                        <p class="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Leads</p>
                        <p class="text-3xl font-bold text-blue-600">${dados.totais.leads}</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl">
                        <p class="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">Consultores</p>
                        <p class="text-3xl font-bold text-purple-600">${dados.totais.consultores}</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
                        <p class="text-xs font-semibold text-green-900 uppercase tracking-wide mb-1">Comentários</p>
                        <p class="text-3xl font-bold text-green-600">${dados.totais.comentarios}</p>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b-2 border-gray-200">
                                <th class="text-left p-4 min-w-[180px] text-xs font-bold text-gray-700 uppercase tracking-wide">Consultor</th>
                                ${listsDef.map(l => `<th class="text-center p-4 text-xs font-medium text-gray-600 uppercase tracking-wide">${l.name}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${dados.consultores.length ? dados.consultores.map(c => `
                                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td class="p-4 font-semibold text-gray-900">
                                        ${c.nome} ${c.comentarios > 0 ? `<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs ml-2">${c.comentarios}</span>` : ''}
                                    </td>
                                    ${listsDef.map(l => `
                                        <td class="p-4 text-center">
                                            ${c.listCounts[l.id] > 0 ? `<span class="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">${c.listCounts[l.id]}</span>` : '<span class="text-gray-300">—</span>'}
                                        </td>
                                    `).join('')}
                                </tr>
                            `).join('') : `
                                <tr><td colspan="${1 + listsDef.length}" class="p-8 text-center text-gray-400 italic">Nenhum dado encontrado</td></tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return `
            <div class="space-y-6">
                <!-- Header -->
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

                <!-- Tempo de Permanência -->
                <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl shadow-lg p-8 border border-gray-200">
                    <div class="mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span class="text-4xl"></span> Tempo médio de espera
                        </h2>
                        <p class="text-sm text-gray-500 mt-2 font-light">Análise de performance da última semana</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-8">
                        <!-- LEADS -->
                        <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span class="text-2xl"></span> ${temposListas.leads.nomeList || 'LEADS'}
                                </h3>
                                <span class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold">
                                    ${temposListas.leads.tempos?.length || 0} cards
                                </span>
                            </div>
                            
                            <!-- Tempo Médio Destacado -->
                            <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl mb-6 shadow-lg">
                                <div class="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Tempo Médio
                                </div>
                                <div class="text-5xl font-black text-white">
                                    ${temposListas.leads.media ? Utils.formatarTempo(temposListas.leads.media) : '0h'}
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <!-- Mais Rápido -->
                                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                                    <div class="flex items-center gap-2 text-xs font-bold text-green-900 uppercase tracking-wide mb-3">
                                        <span class="text-lg"></span> Mais Rápido
                                    </div>
                                    ${temposListas.leads.maisRapido ? `
                                        <div class="text-2xl font-bold text-green-600 mb-2">
                                            ${Utils.formatarTempo(temposListas.leads.maisRapido.tempo)}
                                        </div>
                                        <div class="text-xs text-gray-700 font-medium line-clamp-2 bg-white/50 p-2 rounded" title="${temposListas.leads.maisRapido.cardNome}">
                                            ${temposListas.leads.maisRapido.cardNome}
                                        </div>
                                    ` : '<div class="text-sm text-gray-400">—</div>'}
                                </div>
                                
                                <!-- Mais Lento -->
                                <div class="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border border-red-200">
                                    <div class="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wide mb-3">
                                        <span class="text-lg"></span> Mais Lento
                                    </div>
                                    ${temposListas.leads.maisLento ? `
                                        <div class="text-2xl font-bold text-red-600 mb-2">
                                            ${Utils.formatarTempo(temposListas.leads.maisLento.tempo)}
                                        </div>
                                        <div class="text-xs text-gray-700 font-medium line-clamp-2 bg-white/50 p-2 rounded" title="${temposListas.leads.maisLento.cardNome}">
                                            ${temposListas.leads.maisLento.cardNome}
                                        </div>
                                    ` : '<div class="text-sm text-gray-400">—</div>'}
                                </div>
                            </div>
                        </div>

                        <!-- Não Atendeu -->
                        <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span class="text-2xl"></span> ${temposListas.naoAtendeu.nomeList || 'Não atendeu'}
                                </h3>
                                <span class="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold">
                                    ${temposListas.naoAtendeu.tempos?.length || 0} cards
                                </span>
                            </div>
                            
                            <!-- Tempo Médio Destacado -->
                            <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl mb-6 shadow-lg">
                                <div class="text-orange-100 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Tempo Médio
                                </div>
                                <div class="text-5xl font-black text-white">
                                    ${temposListas.naoAtendeu.media ? Utils.formatarTempo(temposListas.naoAtendeu.media) : '0h'}
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <!-- Mais Rápido -->
                                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                                    <div class="flex items-center gap-2 text-xs font-bold text-green-900 uppercase tracking-wide mb-3">
                                        <span class="text-lg"></span> Mais Rápido
                                    </div>
                                    ${temposListas.naoAtendeu.maisRapido ? `
                                        <div class="text-2xl font-bold text-green-600 mb-2">
                                            ${Utils.formatarTempo(temposListas.naoAtendeu.maisRapido.tempo)}
                                        </div>
                                        <div class="text-xs text-gray-700 font-medium line-clamp-2 bg-white/50 p-2 rounded" title="${temposListas.naoAtendeu.maisRapido.cardNome}">
                                            ${temposListas.naoAtendeu.maisRapido.cardNome}
                                        </div>
                                    ` : '<div class="text-sm text-gray-400">—</div>'}
                                </div>
                                
                                <!-- Mais Lento -->
                                <div class="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border border-red-200">
                                    <div class="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wide mb-3">
                                        <span class="text-lg"></span> Mais Lento
                                    </div>
                                    ${temposListas.naoAtendeu.maisLento ? `
                                        <div class="text-2xl font-bold text-red-600 mb-2">
                                            ${Utils.formatarTempo(temposListas.naoAtendeu.maisLento.tempo)}
                                        </div>
                                        <div class="text-xs text-gray-700 font-medium line-clamp-2 bg-white/50 p-2 rounded" title="${temposListas.naoAtendeu.maisLento.cardNome}">
                                            ${temposListas.naoAtendeu.maisLento.cardNome}
                                        </div>
                                    ` : '<div class="text-sm text-gray-400">—</div>'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Atividade dos Usuários -->
                <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span></span> Atividade dos utilizadores
                        </h2>
                        <p class="text-sm text-gray-500 mt-1 font-light">Última semana</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Mais Ativo -->
                        <div class="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
Utilizador mais ativo                            </h3>
                            ${kpis.atividade?.maisAtivo ? `
                                <div class="space-y-3">
                                    <div class="bg-white p-4 rounded-lg shadow-sm">
                                        <div class="text-xl font-bold text-gray-900 mb-3">
                                            ${kpis.atividade.maisAtivo.nome}
                                        </div>
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="text-3xl font-bold text-green-600">
                                                ${kpis.atividade.maisAtivo.acoes}
                                            </span>
                                            <span class="text-sm text-gray-600">ações no Trello</span>
                                        </div>
                                        

                                    </div>
                                    <p class="text-xs text-green-900 bg-green-50 p-3 rounded-lg">
                                         Este utilizador realizou mais ações (comentários, movimentações, criação de cards) durante a última semana.
                                    </p>
                                </div>
                            ` : '<div class="text-sm text-gray-400">Sem dados disponíveis</div>'}
                        </div>

                        <!-- Mais Inativo -->
                        <div class="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                                 Utilizador Mais Inativo
                            </h3>
                            ${kpis.atividade?.maisInativo ? `
                                <div class="space-y-3">
                                    <div class="bg-white p-4 rounded-lg shadow-sm">
                                        <div class="text-xl font-bold text-gray-900 mb-3">
                                            ${kpis.atividade.maisInativo.nome}
                                        </div>
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="text-3xl font-bold text-yellow-600">
                                                ${kpis.atividade.maisInativo.acoes}
                                            </span>
                                            <span class="text-sm text-gray-600">ações no Trello</span>
                                        </div>
                                        

                                    </div>
                                    <p class="text-xs text-yellow-900 bg-yellow-50 p-3 rounded-lg">
                                      Utilizador menos ativo
                                    </p>
                                </div>
                            ` : '<div class="text-sm text-gray-400">Sem dados disponíveis</div>'}
                        </div>
                    </div>
                </div>

                <!-- Tabela de DUEs -->
                <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <div class="flex items-center gap-3 mb-6">
                       <span class="text-2xl"></span>
                       <div>
                           <h2 class="text-2xl font-bold text-gray-900">Follo ups marcados com Datas</h2>
                       </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="text-left p-4 min-w-[180px] text-xs font-bold text-gray-700 uppercase tracking-wide">Consultor</th>
                                    <th class="text-center p-4 text-xs font-bold text-indigo-700 uppercase tracking-wide"> Follow Ups Criados</th>
                                    <th class="text-center p-4 text-xs font-bold text-green-700 uppercase tracking-wide"> Follow Ups A Tempo</th>
                                    <th class="text-center p-4 text-xs font-bold text-orange-700 uppercase tracking-wide">Follow Ups Atrasados</th>
                                    <th class="text-center p-4 text-xs font-bold text-red-700 uppercase tracking-wide"> Follow Ups Pendentes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dadosSemanal.consultores.length ? dadosSemanal.consultores
                .filter(c => (c.duesCriados || 0) + (c.duesATempo || 0) + (c.duesAtrasados || 0) + (c.duesPendentes || 0) > 0)
                .map(c => `
                                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td class="p-4 font-semibold text-gray-900">${c.nome}</td>
                                        <td class="p-4 text-center">
                                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">${c.duesCriados || 0}</span>
                                        </td>
                                        <td class="p-4 text-center">
                                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-700 font-bold text-sm">${c.duesATempo || 0}</span>
                                        </td>
                                        <td class="p-4 text-center">
                                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-orange-700 font-bold text-sm">${c.duesAtrasados || 0}</span>
                                        </td>
                                        <td class="p-4 text-center">
                                            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-700 font-bold text-sm">${c.duesPendentes || 0}</span>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr><td colspan="5" class="p-8 text-center text-gray-400 italic">Nenhum DUE registrado esta semana</td></tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                ${renderTabela('Dados de Leads Esta Semana', dadosSemanal, '')}
                ${renderTabela('Dados de Leads Gerais', dadosGeral, '')}
            </div>
        `;
    }
};
