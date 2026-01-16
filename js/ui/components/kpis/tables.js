UI.renderTable = function (titulo, dados, listsDef, colorTheme = 'slate') {
    // Tema dark neutro
    const borderColor = 'border-gray-800';
    const bgColor = 'bg-[#1e293b]';

    return `
        <div class="${bgColor} rounded-3xl shadow-xl p-8 border ${borderColor}">
            <div class="flex items-center gap-3 mb-8">
              
                <div>
                     <h2 class="text-2xl font-bold text-white">${titulo}</h2>
                     <p class="text-sm text-gray-500 font-light mt-1">Análise detalhada por lista</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- LEADS -->
                <div class="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group">
                     <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total de Leads</p>
                        <p class="text-4xl font-black text-white tracking-tight">${dados.totais.leads}</p>
                     </div>
                </div>

                <!-- CONSULTORES -->
                <div class="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group">
                     <div class="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Consultores</p>
                        <p class="text-4xl font-black text-white tracking-tight">${dados.totais.consultores}</p>
                     </div>
                </div>

                <!-- COMENTÁRIOS -->
                <div class="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group">
                     <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Comentários</p>
                        <p class="text-4xl font-black text-white tracking-tight">${dados.totais.comentarios}</p>
                     </div>
                </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-gray-800">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-800/50 border-b border-gray-800">
                            <th class="text-left p-4 min-w-[200px] text-xs font-bold text-gray-400 uppercase tracking-wide">Consultor</th>
                            ${listsDef.map(l => `<th class="text-center p-4 text-xs font-bold text-gray-400 uppercase tracking-wide">${l.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800 text-sm">
                        ${dados.consultores.length ? dados.consultores.map(c => `
                            <tr class="hover:bg-slate-800/30 transition-colors">
                                <td class="p-4 font-semibold text-gray-200 flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-300">
                                        ${c.nome.charAt(0)}
                                    </div>
                                    <span>${c.nome}</span>
                                    ${c.comentarios > 0 ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-900/30 text-blue-400 border border-blue-500/20 font-bold ml-auto"><span class="text-[9px]">💬</span> ${c.comentarios}</span>` : ''}
                                </td>
                                ${listsDef.map(l => `
                                    <td class="p-4 text-center">
                                        ${c.listCounts[l.id] > 0 ?
            `<span class="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-2 rounded-lg bg-[#0f172a] text-white font-bold border border-gray-700 shadow-sm">${c.listCounts[l.id]}</span>`
            : '<span class="text-gray-600 font-light">-</span>'}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('') : `
                            <tr><td colspan="${1 + listsDef.length}" class="p-8 text-center text-gray-500 italic">Nenhum dado encontrado</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

UI.renderDueDatesTable = function (dadosSemanal) {
    return `
        <div class="bg-[#1e293b] rounded-3xl shadow-xl p-8 border border-gray-800 mt-8">
            <div class="flex items-center gap-3 mb-8">
              
                <div>
                    <h2 class="text-2xl font-bold text-white">Follow-ups Marcados</h2>
                     <p class="text-sm text-gray-500 font-light mt-1">Cumprimento de datas e prazos</p>
                </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-gray-800">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-800/50 border-b border-gray-800">
                            <th class="text-left p-4 min-w-[200px] text-xs font-bold text-gray-400 uppercase tracking-wide">Consultor</th>
                            <th class="text-center p-4 text-xs font-bold text-gray-400 uppercase tracking-wide">Agendados</th>
                            <th class="text-center p-4 text-xs font-bold text-green-400 uppercase tracking-wide">A Tempo</th>
                            <th class="text-center p-4 text-xs font-bold text-red-400 uppercase tracking-wide">Atrasados</th>
                            <th class="text-center p-4 text-xs font-bold text-yellow-400 uppercase tracking-wide">Pendentes</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800 text-sm">
                        ${dadosSemanal.consultores.length ? dadosSemanal.consultores
            .filter(c => (c.duesCriados || 0) + (c.duesATempo || 0) + (c.duesAtrasados || 0) + (c.duesPendentes || 0) > 0)
            .map(c => `
                                <tr class="hover:bg-slate-800/30 transition-colors">
                                    <td class="p-4 font-semibold text-gray-200">
                                         <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-300">
                                                ${c.nome.charAt(0)}
                                            </div>
                                            ${c.nome}
                                        </div>
                                    </td>
                                    <td class="p-4 text-center">
                                        <span class="inline-block min-w-[3ch] py-1 bg-[#0f172a] text-white font-bold rounded border border-gray-700 text-sm">${c.duesCriados || 0}</span>
                                    </td>
                                    <td class="p-4 text-center">
                                        ${(c.duesATempo || 0) > 0 ?
                    `<span class="inline-block min-w-[3ch] py-1 bg-green-900/20 text-green-400 font-bold rounded border border-green-500/20 text-sm">${c.duesATempo}</span>`
                    : '<span class="text-gray-600">-</span>'}
                                    </td>
                                    <td class="p-4 text-center">
                                        ${(c.duesAtrasados || 0) > 0 ?
                    `<span class="inline-block min-w-[3ch] py-1 bg-red-900/20 text-red-400 font-bold rounded border border-red-500/20 text-sm">${c.duesAtrasados}</span>`
                    : '<span class="text-gray-600">-</span>'}
                                    </td>
                                    <td class="p-4 text-center">
                                        ${(c.duesPendentes || 0) > 0 ?
                    `<span class="inline-block min-w-[3ch] py-1 bg-yellow-900/20 text-yellow-500 font-bold rounded border border-yellow-500/20 text-sm">${c.duesPendentes}</span>`
                    : '<span class="text-gray-600">-</span>'}
                                    </td>
                                </tr>
                            `).join('') : `
                            <tr><td colspan="5" class="p-8 text-center text-gray-500 italic">Sem dados de datas para esta semana</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
