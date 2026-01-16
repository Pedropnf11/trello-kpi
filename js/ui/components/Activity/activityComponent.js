UI.renderActivity = function (atividade) {
    if (!atividade || !atividade.maisAtivo) return '';
    return `
        <div class="bg-[#1e293b] rounded-3xl shadow-xl p-8 border border-gray-800 relative overflow-hidden group">
            <!-- Background Glow -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div class="mb-8 relative z-10 flex justify-between items-end">
                <div>
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                       Atividade dos utilizadores
                    </h2>
                    <p class="text-sm text-gray-500 mt-2 font-light">Performance semanal da equipa</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 gap-6 relative z-10">
                <!-- MVP Card (Winner) -->
                <div class="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-yellow-500/20 shadow-lg hover:shadow-yellow-900/10 transition-all duration-300 group/mvp">
                    <div class="absolute top-0 right-0 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-yellow-500/20 uppercase tracking-widest">
                        Top Performer
                    </div>
                    
                    <div class="flex items-center gap-6">
                        <div class="relative">
                            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 shadow-xl">
                                <div class="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden">
                                     ${atividade.maisAtivo.nome.charAt(0)}
                                     <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            </div>
                            <div class="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-lg font-bold border-2 border-slate-900">
                                1
                            </div>
                        </div>
                        
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-white mb-1 group-hover/mvp:text-yellow-400 transition-colors">
                                ${atividade.maisAtivo.nome}
                            </h3>
                            <div class="text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Altamente Produtivo
                            </div>
                            
                            <!-- Mini Stats -->
                            <div class="grid grid-cols-3 gap-2">
                                <div class="bg-slate-800 rounded-lg p-2 border border-slate-700/50">
                                    <div class="text-[10px] text-gray-500 uppercase font-bold">Ações</div>
                                    <div class="text-lg font-black text-white">${atividade.maisAtivo.acoes}</div>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Least Active (Improvement Area) - More Professional -->
                ${atividade.maisInativo && atividade.maisInativo.id !== atividade.maisAtivo.id ? `
                <div class="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-gray-400 font-bold border border-slate-600">
                             ${atividade.maisInativo.nome.charAt(0)}
                        </div>
                        <div>
                            <div class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-0.5">Utilizador menos ativo</div>
                            <div class="text-base font-bold text-gray-200">${atividade.maisInativo.nome}</div>
                        </div>
                    </div>
                    
                    <div class="text-right">
                         <div class="text-2xl font-bold text-gray-300">${atividade.maisInativo.acoes}</div>
                         <div class="text-[10px] text-gray-500 font-bold uppercase">Ações Totais</div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
};

UI.renderActionList = function (atividade, role = 'manager') {
    // Mantendo a tabela detalhada mas com estilo afinado
    if (!atividade || !atividade.todos) return '';
    const users = atividade.todos.slice(0, 10); // Show top 10 only if huge list

    return `
        <div class="bg-[#1e293b] rounded-3xl shadow-xl p-8 border border-gray-800">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                    <span class="text-2xl">📊</span> Ranking Detalhado
                </h2>
            </div>

            <div class="overflow-hidden rounded-2xl border border-gray-800">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-800/50">
                            <th class="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Membro</th>
                            <th class="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Score</th>
                            <th class="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Moves</th>
                            <th class="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center hidden sm:table-cell">Coment.</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800">
                        ${users.map((u, index) => `
                            <tr class="hover:bg-slate-800/30 transition-colors group">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="text-gray-500 font-mono text-xs w-4">${index + 1}</div>
                                        <div class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
                                            ${u.nome.charAt(0)}
                                        </div>
                                        <span class="font-medium text-gray-200 text-sm">${u.nome}</span>
                                        ${index === 0 ? '<span class="ml-2 text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20">👑</span>' : ''}
                                    </div>
                                </td>
                                <td class="p-4 text-center">
                                    <span class="text-white font-bold text-base bg-slate-700/50 px-2 py-1 rounded-md min-w-[3ch] inline-block">${u.acoes}</span>
                                </td>
                                <td class="p-4 text-center">
                                    <span class="text-gray-400 text-sm">${u.moves || 0}</span>
                                </td>
                                <td class="p-4 text-center hidden sm:table-cell">
                                    <span class="text-gray-400 text-sm">${u.comments || 0}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${users.length === 0 ? '<p class="text-center text-gray-500 py-8">Sem dados.</p>' : ''}
        </div>
    `;
};
