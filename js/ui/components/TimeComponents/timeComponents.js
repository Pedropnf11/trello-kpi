UI.renderTimeTracking = function (temposListas, allLists, selectedConfig) {
    const listIds = Object.keys(temposListas);
    if (!listIds.length) return '';

    // Safety check with smart defaults
    let leftId = selectedConfig?.left || listIds.find(id => temposListas[id]?.nome?.toLowerCase().includes('lead')) || listIds[0];
    let rightId = selectedConfig?.right || listIds.find(id => temposListas[id]?.nome?.toLowerCase().includes('nao atendeu')) || listIds[1];

    // Helper robusto para formatar tempo
    const formatTime = (horasDecimais) => {
        if (horasDecimais === undefined || horasDecimais === null) return '0h 0m';
        const num = parseFloat(horasDecimais);
        if (isNaN(num)) return '0h 0m';

        const horas = Math.floor(num);
        const minutos = Math.round((num - horas) * 60);
        return `${horas}h <span class="text-sm opacity-60 font-normal ml-0.5">${minutos}m</span>`;
    };

    const leftItem = temposListas[leftId] || {};
    const rightItem = temposListas[rightId] || {};

    const leftOptions = listIds.map(listId =>
        `<option value="${listId}" ${listId === leftId ? 'selected' : ''} class="bg-[#0f172a] text-gray-300">${temposListas[listId].nome}</option>`
    ).join('');

    const rightOptions = listIds.map(listId =>
        `<option value="${listId}" ${listId === rightId ? 'selected' : ''} class="bg-[#0f172a] text-gray-300">${temposListas[listId].nome}</option>`
    ).join('');

    // All lists sorted by avg time desc for the mini-ranking
    const allSorted = listIds
        .map(id => ({ id, ...temposListas[id] }))
        .sort((a, b) => parseFloat(b.tempoMedio || b.media || 0) - parseFloat(a.tempoMedio || a.media || 0));

    const maxTempo = Math.max(...allSorted.map(l => parseFloat(l.tempoMedio || l.media || 0)), 1);

    return `
        <div class="h-full flex flex-col gap-4">
            <!-- Section label -->
            <div class="flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-4 rounded-full bg-blue-500"></span>
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">TEMPO MÉDIO DE ESPERA</p>
                </div>
                <p class="text-[11px] text-gray-600">Permanência por lista</p>
            </div>

            <!-- Hero layout: 60/40 split -->
            <div class="flex gap-4 flex-1 min-h-0">

                <!-- LEFT: Hero Card (primary list) -->
                <div class="flex-[3] bg-[#111827] rounded-xl p-6 border border-white/[0.04] hover:border-blue-500/10 transition-colors flex flex-col overflow-hidden relative">
                    <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

                    <!-- Dropdown header -->
                    <div class="flex items-center justify-between mb-6 relative z-10">
                        <div class="flex items-center gap-2.5 flex-1 min-w-0">
                            <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div class="relative flex-1 min-w-0">
                                <select id="timeTrackingSelectLeft" class="w-full bg-transparent text-[13px] font-bold text-gray-200 border-0 p-0 pr-5 focus:ring-0 cursor-pointer appearance-none truncate hover:text-white transition-colors">
                                    ${leftOptions}
                                </select>
                                <svg class="w-3 h-3 text-gray-600 absolute right-0 top-0.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-600 tabular-nums ml-3 flex-shrink-0">${leftItem.count || 0} cards</span>
                    </div>

                    <!-- Big hero number -->
                    <div class="flex-1 flex flex-col items-center justify-center relative z-10">
                        <p class="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">TEMPO MÉDIO</p>
                        <div class="text-[4rem] font-bold text-white leading-none tracking-tight flex items-baseline gap-1" id="timeTrackingSelectLeft-media">
                            ${leftItem.media ? formatTime(leftItem.media) : '0h<span class="text-xl opacity-30 ml-1.5 font-normal">0m</span>'}
                        </div>
                    </div>

                    <!-- Rápido / Lento row -->
                    <div class="grid grid-cols-2 gap-2 relative z-10 mt-6">
                        <div class="bg-[#0a0f1a] rounded-lg p-3 border border-white/[0.03] hover:border-emerald-500/10 transition-colors">
                            <div class="flex items-center gap-1.5 mb-2">
                                <svg class="w-3 h-3 text-emerald-500 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                <span class="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Rápido</span>
                            </div>
                            <div id="timeTrackingSelectLeft-rapido">
                                ${leftItem.maisRapido ? `
                                    <div class="text-[13px] font-bold text-white">${formatTime(leftItem.maisRapido.tempo)}</div>
                                    <div class="text-[10px] text-gray-600 truncate mt-0.5" title="${leftItem.maisRapido.cardNome}">${leftItem.maisRapido.cardNome}</div>
                                ` : '<span class="text-[13px] text-gray-700">—</span>'}
                            </div>
                        </div>
                        <div class="bg-[#0a0f1a] rounded-lg p-3 border border-white/[0.03] hover:border-rose-500/10 transition-colors">
                            <div class="flex items-center gap-1.5 mb-2">
                                <svg class="w-3 h-3 text-rose-500 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span class="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Lento</span>
                            </div>
                            <div id="timeTrackingSelectLeft-lento">
                                ${leftItem.maisLento ? `
                                    <div class="text-[13px] font-bold text-white">${formatTime(leftItem.maisLento.tempo)}</div>
                                    <div class="text-[10px] text-gray-600 truncate mt-0.5" title="${leftItem.maisLento.cardNome}">${leftItem.maisLento.cardNome}</div>
                                ` : '<span class="text-[13px] text-gray-700">—</span>'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Compact secondary + all-list ranking -->
                <div class="flex-[2] flex flex-col gap-3 min-w-0">

                    <!-- Secondary selector card -->
                    <div class="bg-[#111827] rounded-xl p-4 border border-white/[0.04] hover:border-blue-500/10 transition-colors flex-shrink-0">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2 flex-1 min-w-0">
                                <svg class="w-3.5 h-3.5 text-blue-400/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <div class="relative flex-1 min-w-0">
                                    <select id="timeTrackingSelectRight" class="w-full bg-transparent text-[12px] font-bold text-gray-300 border-0 p-0 pr-5 focus:ring-0 cursor-pointer appearance-none truncate hover:text-white transition-colors">
                                        ${rightOptions}
                                    </select>
                                    <svg class="w-3 h-3 text-gray-600 absolute right-0 top-0.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                </div>
                            </div>
                            <span class="text-[10px] text-gray-600 tabular-nums ml-2 flex-shrink-0">${rightItem.count || 0}</span>
                        </div>
                        <div class="text-[2rem] font-bold text-white leading-none flex items-baseline gap-1" id="timeTrackingSelectRight-media">
                            ${rightItem.media ? formatTime(rightItem.media) : '0h<span class="text-sm opacity-30 ml-1 font-normal">0m</span>'}
                        </div>
                        <div class="grid grid-cols-2 gap-2 mt-3">
                            <div id="timeTrackingSelectRight-rapido" class="text-[11px]">
                                <span class="text-[9px] text-gray-600 uppercase font-bold block mb-0.5">Rápido</span>
                                ${rightItem.maisRapido ? `<span class="text-emerald-400 font-bold">${formatTime(rightItem.maisRapido.tempo)}</span>` : '<span class="text-gray-700">—</span>'}
                            </div>
                            <div id="timeTrackingSelectRight-lento" class="text-[11px]">
                                <span class="text-[9px] text-gray-600 uppercase font-bold block mb-0.5">Lento</span>
                                ${rightItem.maisLento ? `<span class="text-rose-400 font-bold">${formatTime(rightItem.maisLento.tempo)}</span>` : '<span class="text-gray-700">—</span>'}
                            </div>
                        </div>
                    </div>

                    <!-- All-lists mini ranking -->
                    <div class="bg-[#111827] rounded-xl p-4 border border-white/[0.04] flex-1 overflow-y-auto custom-scrollbar-dark">
                        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-3">Todas as listas</p>
                        <div class="flex flex-col gap-2.5">
                            ${allSorted.map((lista, idx) => {
        const t = parseFloat(lista.tempoMedio || lista.media || 0);
        const barW = Math.max((t / maxTempo) * 100, 2);
        const horas = Math.floor(t);
        const label = t < 1 ? `${Math.round(t * 24)}h` : `${horas}d`;
        const barColor = idx === 0 ? 'bg-rose-500/60' : idx === allSorted.length - 1 ? 'bg-emerald-500/60' : 'bg-blue-500/40';
        return `
                                    <div class="flex items-center gap-2 group">
                                        <span class="text-[9px] text-gray-700 w-3 text-right flex-shrink-0">${idx + 1}</span>
                                        <span class="text-[11px] text-gray-500 w-20 truncate flex-shrink-0 group-hover:text-gray-300 transition-colors" title="${lista.nome}">${lista.nome}</span>
                                        <div class="flex-1 h-1 bg-[#1a2235] rounded-full overflow-hidden">
                                            <div class="${barColor} h-full rounded-full" style="width:${barW}%;"></div>
                                        </div>
                                        <span class="text-[11px] font-bold text-gray-500 w-8 text-right flex-shrink-0 tabular-nums">${label}</span>
                                    </div>
                                `;
    }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

UI.renderResponseTimeWidget = function (tempoResposta) {
    if (!tempoResposta) return '';

    return `
        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-lg p-8 border border-indigo-100">
            <div class="mb-6">
                 <h2 class="text-3xl font-bold text-indigo-900 flex items-center gap-3">
                    <span class="text-4xl">⚡</span> Tempo de Resposta Inicial
                 </h2>
                 <p class="text-sm text-indigo-600/70 mt-2 font-medium">Velocidade do 1º Contacto (Leads Tocado)</p>
            </div>

            <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100 relative overflow-hidden">
                <!-- Data Content -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                         <div class="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Tempo Médio</div>
                         <div class="text-5xl font-black text-indigo-600">
                            ${Utils.formatarTempo(tempoResposta.media)}
                         </div>
                    </div>
                     <span class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                        ${tempoResposta.count} leads analisados
                    </span>
                </div>

                <!-- Footer Stats -->
                 <div class="grid grid-cols-2 gap-4">
                        <div class="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                            <div class="text-[10px] font-bold text-indigo-400 uppercase">Mais Rápido</div>
                            <div class="font-bold text-indigo-800 text-lg">${tempoResposta.maisRapido ? Utils.formatarTempo(tempoResposta.maisRapido.tempo) : '-'}</div>
                            <div class="text-xs text-indigo-600 truncate">${tempoResposta.maisRapido?.consultor || ''}</div>
                        </div>
                         <div class="bg-orange-50 rounded-lg p-3 border border-orange-100">
                            <div class="text-[10px] font-bold text-orange-400 uppercase">Mais Lento</div>
                            <div class="font-bold text-orange-800 text-lg">${tempoResposta.maisLento ? Utils.formatarTempo(tempoResposta.maisLento.tempo) : '-'}</div>
                            <div class="text-xs text-orange-600 truncate">${tempoResposta.maisLento?.consultor || ''}</div>
                        </div>
                 </div>
            </div>
        </div>
    `;
};

UI.renderTempoPermanenciaWidget = function (macroTempos) {
    if (!macroTempos || !macroTempos.listas) return '';

    // Default: Primeira lista
    const defaultListId = macroTempos.primeiraListaId;
    const l = macroTempos.listas[defaultListId] || { geral: { media: 0, count: 0 }, semanal: { media: 0, count: 0 } };

    // Opções do Select
    const options = Object.values(macroTempos.listas).map(list =>
        `<option value="${list.id}" ${list.id === defaultListId ? 'selected' : ''}>${list.nome}</option>`
    ).join('');

    return `
        <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl shadow-lg p-8 border border-gray-200" id="tempoWidgetContainer">
            <div class="mb-8 flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                     Tempo médio de espera 
                    </h2>
                    <p class="text-sm text-gray-500 mt-2 font-light">Selecione a lista para ver a tempo médio de permanência</p>
                </div>
                
                <div class="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                    <select id="tempoListSelect" class="bg-transparent text-gray-900 font-bold text-lg outline-none cursor-pointer pr-8">
                        ${options}
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-8">
                <!-- GERAL (Esquerda) -->
                <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
                    <div class="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Média Geral (Histórico)</div>
                    
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl mb-6 shadow-lg">
                        <div class="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            Tempo Médio
                        </div>
                        <div class="text-5xl font-black text-white" id="valGeralMedia">
                            ${Utils.formatarTempo(l.geral.media)}
                        </div>
                    </div>

                    <div class="space-y-4">
                         <!-- Mais Rápido GERAL -->
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                             <div class="text-[10px] font-bold text-blue-400 uppercase">Recorde (Rápido)</div>
                             <div class="text-xl font-bold text-blue-800" id="valGeralRapido">${l.geral.maisRapido ? Utils.formatarTempo(l.geral.maisRapido.tempo) : '-'}</div>
                             <div class="text-xs text-blue-600 truncate" id="valGeralRapidoNome">${l.geral.maisRapido?.consultor || ''}</div>
                        </div>
                    </div>
                </div>

                <!-- SEMANAL (Direita) - Comparação -->
                <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300">
                    <div class="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">Nesta Semana (Comparação)</div>
                    
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl mb-6 shadow-lg">
                        <div class="text-purple-100 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            Tempo Médio (Semana)
                        </div>
                        <div class="text-5xl font-black text-white" id="valSemanalMedia">
                            ${Utils.formatarTempo(l.semanal.media)}
                        </div>
                    </div>

                    <div class="space-y-4">
                         <!-- Mais Lento SEMANA -->
                        <div class="bg-purple-50 p-4 rounded-xl border border-purple-100">
                             <div class="text-[10px] font-bold text-purple-400 uppercase">Mais Lento (Semana)</div>
                             <div class="text-xl font-bold text-purple-800" id="valSemanalLento">${l.semanal.maisLento ? Utils.formatarTempo(l.semanal.maisLento.tempo) : '-'}</div>
                             <div class="text-xs text-purple-600 truncate" id="valSemanalLentoNome">${l.semanal.maisLento?.consultor || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
