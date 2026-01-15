UI.renderTable = function (titulo, dados, listsDef, colorTheme = 'slate') {
    const isBlue = colorTheme === 'blue';
    const headerColor = isBlue ? 'text-blue-400' : 'text-slate-400';
    const borderColor = isBlue ? 'border-blue-900/30' : 'border-slate-800';
    const bgColor = isBlue ? 'bg-blue-900/10' : 'bg-[#1e293b]';

    return `
        <div class="${bgColor} rounded-2xl shadow-sm p-8 border ${borderColor}">
            <div class="flex items-center gap-3 mb-8">
                <h2 class="text-2xl font-bold text-white">${titulo}</h2>
            </div>


            <div class="grid grid-cols-3 gap-4 mb-8">
                <!-- LEADS -->
                <div class="bg-[#0f172a] p-4 rounded-xl border border-blue-900/30 shadow-inner group relative overflow-hidden">
                     <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Leads</p>
                        <p class="text-3xl font-black text-white tracking-tight">${dados.totais.leads}</p>
                     </div>
                </div>

                <!-- CONSULTORES -->
                <div class="bg-[#0f172a] p-4 rounded-xl border border-blue-900/30 shadow-inner group relative overflow-hidden">
                     <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Consultores</p>
                        <p class="text-3xl font-black text-white tracking-tight">${dados.totais.consultores}</p>
                     </div>
                </div>

                <!-- COMENTÁRIOS -->
                <div class="bg-[#0f172a] p-4 rounded-xl border border-blue-900/30 shadow-inner group relative overflow-hidden">
                     <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div class="relative z-10">
                        <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Comentários</p>
                        <p class="text-3xl font-black text-white tracking-tight">${dados.totais.comentarios}</p>
                     </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b-2 border-gray-700">
                            <th class="text-left p-4 min-w-[180px] text-xs font-bold text-gray-300 uppercase tracking-wide">Consultor</th>
                            ${listsDef.map(l => `<th class="text-center p-4 text-xs font-medium text-gray-400 uppercase tracking-wide">${l.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.consultores.length ? dados.consultores.map(c => `
                            <tr class="border-b border-gray-700 hover:bg-gray-800/50 transition">
                                <td class="p-4 font-semibold text-white">
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
};

UI.renderDueDatesTable = function (dadosSemanal) {
    return `
        <div class="bg-[#1e293b] rounded-2xl shadow-sm p-8 border border-gray-100">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-2xl"></span>
                <div>
                    <h2 class="text-2xl font-bold text-white-900">Follo ups marcados com Datas</h2>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b-2 border-gray-200">
                            <th class="text-left p-4 min-w-[180px] text-xs font-bold text-white-900 uppercase tracking-wide">Consultor</th>
                            <th class="text-center p-4 text-xs font-bold text-white-900 uppercase tracking-wide"> Follow Ups Criados</th>
                            <th class="text-center p-4 text-xs font-bold text-white-900 uppercase tracking-wide"> Follow Ups A Tempo</th>
                            <th class="text-center p-4 text-xs font-bold text-white-900 uppercase tracking-wide">Follow Ups Atrasados</th>
                            <th class="text-center p-4 text-xs font-bold text-white-900 uppercase tracking-wide"> Follow Ups Pendentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dadosSemanal.consultores.length ? dadosSemanal.consultores
            .filter(c => (c.duesCriados || 0) + (c.duesATempo || 0) + (c.duesAtrasados || 0) + (c.duesPendentes || 0) > 0)
            .map(c => `
                                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td class="p-4 font-semibold text-white">${c.nome}</td>
                                    <td class="p-4 text-center">
                                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-50 text-white font-bold text-sm">${c.duesCriados || 0}</span>
                                    </td>
                                    <td class="p-4 text-center">
                                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-50 text-white font-bold text-sm">${c.duesATempo || 0}</span>
                                    </td>
                                    <td class="p-4 text-center">
                                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-50 text-white font-bold text-sm">${c.duesAtrasados || 0}</span>
                                    </td>
                                    <td class="p-4 text-center">
                                        <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white-50 text-white font-bold text-sm">${c.duesPendentes || 0}</span>
                                    </td>
                                </tr>
                            `).join('') : `
                            <tr><td colspan="5" class="p-8 text-center text-gray-400 italic">Nenhum DUE registrado esta semana</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
