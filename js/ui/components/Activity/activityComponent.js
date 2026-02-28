UI.renderActivity = function (atividade) {
    if (!atividade || !atividade.maisAtivo) return '';

    const todos = (atividade.todos || []).slice(0, 8);
    const maxAcoes = Math.max(...todos.map(u => u.acoes || 0), 1);

    return `
        <div class="flex flex-col gap-5 h-full">
            <!-- Header -->
            <div class="flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-4 rounded-full bg-amber-500"></span>
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">ATIVIDADE DA EQUIPA</p>
                </div>
                <span class="text-[11px] text-gray-600">Esta semana</span>
            </div>

            <!-- Top Performer highlight -->
            <div class="bg-[#0f172a] rounded-xl p-4 border border-amber-500/15 relative overflow-hidden flex-shrink-0">
                <div class="absolute top-0 right-0 text-[9px] font-bold text-amber-500 bg-amber-500/10 border-b border-l border-amber-500/20 px-2.5 py-1 rounded-bl-lg tracking-widest uppercase">TOP</div>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center text-[18px] font-bold text-amber-400 flex-shrink-0">
                        ${atividade.maisAtivo.nome.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-0.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Mais Activo</span>
                        </div>
                        <p class="text-[14px] font-bold text-white truncate">${atividade.maisAtivo.nome}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="text-[22px] font-bold text-white tabular-nums leading-none">${atividade.maisAtivo.acoes}</p>
                        <p class="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mt-0.5">ações</p>
                    </div>
                </div>
            </div>

            <!-- Ranking list -->
            ${todos.length > 1 ? `
            <div class="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar-dark">
                ${todos.map((u, idx) => {
        const barW = Math.max((u.acoes / maxAcoes) * 100, 2);
        const isTop = idx === 0;
        const isLast = atividade.maisInativo && u.id === atividade.maisInativo.id && !isTop;
        return `
                        <div class="flex items-center gap-3 group hover:bg-white/[0.02] rounded-lg px-2 py-1.5 transition-colors">
                            <span class="text-[10px] font-bold text-gray-700 w-4 text-right flex-shrink-0">${idx + 1}</span>
                            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${isTop ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-[#1e293b] text-gray-400 border border-white/[0.04]'}">
                                ${u.nome.charAt(0).toUpperCase()}
                            </div>
                            <span class="text-[12px] font-semibold text-gray-400 w-24 truncate flex-shrink-0 group-hover:text-gray-200 transition-colors ${isLast ? 'text-rose-400/70' : ''}" title="${u.nome}">${u.nome}</span>
                            <div class="flex-1 h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-700 ${isTop ? 'bg-amber-500/60' : isLast ? 'bg-rose-500/40' : 'bg-blue-500/40'}" style="width:${barW}%;"></div>
                            </div>
                            <span class="text-[13px] font-bold text-gray-400 w-8 text-right flex-shrink-0 tabular-nums">${u.acoes}</span>
                        </div>
                    `;
    }).join('')}
            </div>
            ` : ''}
        </div>
    `;
};

UI.renderActionList = function (atividade, role = 'manager') {
    if (!atividade || !atividade.todos) return '';
    const users = atividade.todos.slice(0, 10);
    const maxAcoes = Math.max(...users.map(u => u.acoes || 0), 1);

    return `
        <div class="flex flex-col gap-5">
            <!-- Header -->
            <div class="flex items-center gap-2.5">
                <span class="w-1.5 h-4 rounded-full bg-indigo-500"></span>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">RANKING DETALHADO</p>
            </div>

            <!-- Table -->
            <div class="overflow-hidden rounded-xl border border-white/[0.04]">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/[0.04]">
                            <th class="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.12em]">Membro</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em]">Ações</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] hidden sm:table-cell">Moves</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] hidden sm:table-cell">Coment.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map((u, idx) => `
                            <tr class="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2.5">
                                        <span class="text-[10px] font-bold text-gray-700 w-4">${idx + 1}</span>
                                        <div class="w-7 h-7 rounded-lg bg-[#1e293b] flex items-center justify-center text-[11px] font-bold text-gray-300 border border-white/[0.04]">
                                            ${u.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <span class="text-[13px] font-semibold text-gray-300 group-hover:text-white transition-colors">${u.nome}</span>
                                        ${idx === 0 ? '<span class="ml-1 text-[10px] text-amber-500">👑</span>' : ''}
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-[#0f172a] text-white text-[12px] font-bold border border-white/[0.06]">${u.acoes}</span>
                                </td>
                                <td class="px-4 py-3 text-center hidden sm:table-cell">
                                    <span class="text-[12px] text-gray-500">${u.moves || 0}</span>
                                </td>
                                <td class="px-4 py-3 text-center hidden sm:table-cell">
                                    <span class="text-[12px] text-gray-500">${u.comments || 0}</span>
                                </td>
                            </tr>
                        `).join('')}
                        ${users.length === 0 ? '<tr><td colspan="4" class="px-4 py-10 text-center text-[12px] text-gray-600">Sem dados de atividade</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
