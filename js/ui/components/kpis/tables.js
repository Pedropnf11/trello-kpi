UI.renderTable = function (titulo, dados, listsDef, colorTheme = 'slate') {
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;
    const accentMap = {
        blue: { dot: 'bg-blue-500', text: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
        gray: { dot: 'bg-gray-500', text: 'text-gray-400', badge: 'bg-gray-500/10 border-gray-500/20 text-gray-400' },
        slate: { dot: 'bg-slate-500', text: 'text-slate-400', badge: 'bg-slate-500/10 border-slate-500/20 text-slate-400' },
    };
    const accent = accentMap[colorTheme] || accentMap.slate;

    return `
        <div class="flex flex-col gap-5">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-4 rounded-full ${accent.dot}"></span>
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">${titulo}</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Leads</span>
                        <span class="text-[13px] font-bold text-white tabular-nums">${dados.totais.leads}</span>
                    </div>
                    <div class="w-px h-3 bg-white/[0.06]"></div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">${t('Consultores', 'Agents')}</span>
                        <span class="text-[13px] font-bold text-white tabular-nums">${dados.totais.consultores}</span>
                    </div>
                    <div class="w-px h-3 bg-white/[0.06]"></div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Follow-ups</span>
                        <span class="text-[13px] font-bold text-white tabular-nums">${dados.totais.comentarios}</span>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto rounded-xl border border-white/[0.04]">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/[0.04]">
                            <th class="text-left px-4 py-3 min-w-[180px] text-[10px] font-bold text-gray-600 uppercase tracking-[0.12em]">${t('Consultor', 'Agent')}</th>
                            ${listsDef.map(l => `<th class="text-center px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em] whitespace-nowrap">${Utils.escapeHtml(l.name)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.consultores.length ? dados.consultores.map((c, idx) => `
                            <tr class="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-7 h-7 rounded-lg bg-[#1e293b] flex items-center justify-center text-[11px] font-bold text-gray-300 border border-white/[0.04] flex-shrink-0">
                                            ${c.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <span class="text-[13px] font-semibold text-gray-300 group-hover:text-white transition-colors truncate">${Utils.escapeHtml(c.nome)}</span>
                                        ${c.comentarios > 0 ? `<span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${accent.badge} border flex-shrink-0">💬 ${c.comentarios}</span>` : ''}
                                    </div>
                                </td>
                                ${listsDef.map(l => `
                                    <td class="px-4 py-3 text-center">
                                        ${c.listCounts[l.id] > 0
            ? `<span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-[#0f172a] text-white text-[12px] font-bold border border-white/[0.06]">${c.listCounts[l.id]}</span>`
            : '<span class="text-gray-700 text-[12px]">—</span>'
        }
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('') : `
                            <tr><td colspan="${1 + listsDef.length}" class="px-4 py-10 text-center text-[12px] text-gray-600 font-medium">${t('Nenhum dado encontrado', 'No data found')}</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

UI.renderDueDatesTable = function (dadosSemanal) {
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;
    const consultoresComDados = dadosSemanal.consultores.filter(
        c => (c.duesCriados || 0) + (c.duesATempo || 0) + (c.duesAtrasados || 0) + (c.duesPendentes || 0) > 0
    );

    return `
        <div class="flex flex-col gap-5">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-4 rounded-full bg-violet-500"></span>
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">${t('Follow-ups Marcados', 'Scheduled Follow-ups')}</p>
                </div>
                <p class="text-[11px] text-gray-600">${t('Cumprimento de datas e prazos', 'Date and deadline compliance')}</p>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto rounded-xl border border-white/[0.04]">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/[0.04]">
                            <th class="text-left px-4 py-3 min-w-[180px] text-[10px] font-bold text-gray-600 uppercase tracking-[0.12em]">${t('Consultor', 'Agent')}</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em]">${t('Agendados', 'Scheduled')}</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-emerald-600 uppercase tracking-[0.1em]">${t('A Tempo', 'On Time')}</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-rose-600 uppercase tracking-[0.1em]">${t('Atrasados', 'Overdue')}</th>
                            <th class="text-center px-4 py-3 text-[10px] font-bold text-amber-600 uppercase tracking-[0.1em]">${t('Pendentes', 'Pending')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${consultoresComDados.length ? consultoresComDados.map(c => `
                            <tr class="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-7 h-7 rounded-lg bg-[#1e293b] flex items-center justify-center text-[11px] font-bold text-gray-300 border border-white/[0.04] flex-shrink-0">
                                            ${c.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <span class="text-[13px] font-semibold text-gray-300 group-hover:text-white transition-colors">${Utils.escapeHtml(c.nome)}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-[#0f172a] text-gray-300 text-[12px] font-bold border border-white/[0.06]">${c.duesCriados || 0}</span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    ${(c.duesATempo || 0) > 0
            ? `<span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-emerald-500/10 text-emerald-400 text-[12px] font-bold border border-emerald-500/20">${c.duesATempo}</span>`
            : '<span class="text-gray-700 text-[12px]">—</span>'}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    ${(c.duesAtrasados || 0) > 0
            ? `<span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-rose-500/10 text-rose-400 text-[12px] font-bold border border-rose-500/20">${c.duesAtrasados}</span>`
            : '<span class="text-gray-700 text-[12px]">—</span>'}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    ${(c.duesPendentes || 0) > 0
            ? `<span class="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-amber-500/10 text-amber-400 text-[12px] font-bold border border-amber-500/20">${c.duesPendentes}</span>`
            : '<span class="text-gray-700 text-[12px]">—</span>'}
                                </td>
                            </tr>
                        `).join('') : `
                            <tr><td colspan="5" class="px-4 py-10 text-center text-[12px] text-gray-600 font-medium">${t('Sem dados de datas para este período', 'No date data for this period')}</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
