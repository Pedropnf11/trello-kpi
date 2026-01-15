UI.renderActivity = function (atividade) {
    if (!atividade) return '';
    return `
        <div class="bg-[#1e293b] rounded-1x1 shadow-sm p-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                    <span></span> Atividade dos utilizadores
                </h2>
                <p class="text-sm text-gray-500 mt-1 font-light">Última semana</p>
            </div>
            
            <div class="grid grid-cols-1 gap-6">
                <!-- Mais Ativo -->
                <div class="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                        Utilizador mais ativo
                    </h3>
                    ${atividade.maisAtivo ? `
                        <div class="space-y-3">
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="text-xl font-bold text-gray-900 mb-3">
                                    ${atividade.maisAtivo.nome}
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="text-3xl font-bold text-green-600">
                                        ${atividade.maisAtivo.acoes}
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
                <div class="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                            Utilizador Mais Inativo
                    </h3>
                    ${atividade.maisInativo ? `
                        <div class="space-y-3">
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="text-xl font-bold text-gray-900 mb-3">
                                    ${atividade.maisInativo.nome}
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="text-3xl font-bold text-yellow-600">
                                        ${atividade.maisInativo.acoes}
                                    </span>
                                    <span class="text-sm text-gray-600">ações no Trello</span>
                                </div>
                                
                            </div>
                            <p class="text-xs text-red-900 bg-red-50 p-3 rounded-lg">
                                Utilizador menos ativo
                            </p>
                        </div>
                    ` : '<div class="text-sm text-gray-400">Sem dados disponíveis</div>'}
                </div>
            </div>
        </div>
    `;
};

UI.renderActionList = function (atividade, role = 'manager') {
    if (!atividade || !atividade.todos) return '';

    // Se for 'sales', mostrar apenas as ações do próprio usuário (simulado pelo seletor ou todos se manager)
    // Mas o pedido foi "quero lista de ações por utilizadores... tanto na versão de vendedor como gestor"
    // Então vamos mostrar a lista. Talvez simplificada para vendedor? 
    // Vamos assumir lista completa para ambos, mas o vendedor foca na sua.

    // Lista ordenada por atividade
    const users = atividade.todos;

    return `
        <div class="bg-[#1e293b] rounded-2xl shadow-sm p-8 border border-gray-100">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-white-900 flex items-center gap-2">
                        <span>📋</span> Ranking de Ações
                    </h2>
                    <p class="text-sm text-gray-500 mt-1 font-light">Total de interações na semana</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th class="p-3 border-b-2 border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">Membro</th>
                            <th class="p-3 border-b-2 border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                            <th class="p-3 border-b-2 border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Deadline</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-gray-700">
                        ${users.map((u, index) => `
                            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <td class="p-4 font-medium flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white shadow-sm">
                                        ${u.nome.charAt(0)}
                                    </div>
                                    <span>${u.nome}</span>
                                    ${index === 0 ? '<span class="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold ml-auto">🏆 MVP</span>' : ''}
                                </td>
                                <td class="p-4 text-right font-bold text-gray-900">
                                    ${u.acoes}
                                </td>
                                <td class="p-4 text-right space-y-1">
                                    <div class="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded inline-block">
                                        ${u.duesATempo} pontuais
                                    </div>
                                    <div class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded inline-block ml-1">
                                        ${u.duesAtrasadas} atrasos
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${users.length === 0 ? '<p class="text-center text-gray-400 py-8">Sem atividade registrada no período.</p>' : ''}
        </div>
    `;
};
