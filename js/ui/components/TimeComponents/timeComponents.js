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

    const card = (id, htmlId) => {
        const item = temposListas[id] || {};
        const options = listIds.map(listId =>
            `<option value="${listId}" ${listId === id ? 'selected' : ''} class="bg-[#0f172a] text-gray-300">
                ${temposListas[listId].nome}
            </option>`
        ).join('');

        // TEMA ÚNICO PROFISSIONAL (AZUL/SLATE)
        const theme = {
            border: 'border-blue-500/20 hover:border-blue-500/40', // Borda Visível e Azulada
            glow: 'shadow-blue-900/5',
            gradient: 'from-blue-600/5 to-transparent',
            iconBg: 'bg-blue-500/10 text-blue-400', // Emoji Azul
            selectText: 'text-gray-100 placeholder-gray-400',
            statLabel: 'text-blue-400/80',
            subStatBg: 'bg-[#0f172a]/40',
        };

        return `
            <div class="relative group bg-[#1e293b]/50 backdrop-blur-sm rounded-3xl p-6 border ${theme.border} transition-all duration-500 hover:shadow-2xl hover:${theme.glow} flex flex-col h-full overflow-hidden">
                <!-- Background Gradient Effect -->
                <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${theme.gradient} rounded-bl-[100px] -mr-8 -mt-8 opacity-60 pointer-events-none"></div>

                <!-- Header: Icon & Select -->
                <div class="flex justify-between items-center mb-8 relative z-10">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center shadow-lg border border-white/5 flex-shrink-0">
                            <!-- Ícone Padronizado Azul -->
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div class="relative flex-1 group/select min-w-0">
                            <select id="${htmlId}" class="w-full bg-transparent text-lg font-bold ${theme.selectText} border-0 p-0 pr-8 focus:ring-0 cursor-pointer appearance-none truncate transition-colors hover:text-white">
                                ${options}
                            </select>
                            <svg class="w-4 h-4 text-gray-500 absolute right-0 top-1.5 pointer-events-none transition-transform group-hover/select:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400 bg-[#0f172a] px-3 py-1 rounded-full border border-gray-800 shadow-inner flex-shrink-0 ml-2">
                        ${item.count || 0} CARDS
                    </span>
                </div>

                <!-- Main Stat: Tempo Médio -->
                <div class="text-center mb-8 relative z-10">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-center items-center gap-2">
                        <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                        Tempo Médio
                        <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    </p>
                    <div class="text-5xl lg:text-6xl font-medium text-white tracking-tight flex items-baseline justify-center gap-1 drop-shadow-lg" id="${htmlId}-media">
                        ${item.media ? formatTime(item.media) : '0h<span class="text-sm opacity-60 ml-0.5 font-normal">0m</span>'}
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-3 mt-auto relative z-10">
                    <!-- Mais Rápido -->
                    <div class="${theme.subStatBg} backdrop-blur rounded-2xl p-4 border border-gray-800/50 hover:border-green-500/20 transition-colors group/stat">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="p-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/10">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover/stat:text-green-500/70 transition-colors">Rápido</span>
                        </div>
                        <div id="${htmlId}-rapido">
                            ${item.maisRapido ? `
                                <div class="text-lg font-bold text-white mb-0.5">
                                    ${formatTime(item.maisRapido.tempo)}
                                </div>
                                <div class="text-[10px] text-gray-500 truncate font-mono opacity-70" title="${item.maisRapido.cardNome}">
                                    ${item.maisRapido.cardNome}
                                </div>
                            ` : '<span class="text-sm text-gray-600">-</span>'}
                        </div>
                    </div>

                    <!-- Mais Lento -->
                    <div class="${theme.subStatBg} backdrop-blur rounded-2xl p-4 border border-gray-800/50 hover:border-red-500/20 transition-colors group/stat">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/10">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover/stat:text-red-500/70 transition-colors">Lento</span>
                        </div>
                        <div id="${htmlId}-lento">
                            ${item.maisLento ? `
                                <div class="text-lg font-bold text-white mb-0.5">
                                    ${formatTime(item.maisLento.tempo)}
                                </div>
                                <div class="text-[10px] text-gray-500 truncate font-mono opacity-70" title="${item.maisLento.cardNome}">
                                    ${item.maisLento.cardNome}
                                </div>
                            ` : '<span class="text-sm text-gray-600">-</span>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    return `
        <div class="h-full flex flex-col">
            <div class="mb-6 flex items-center justify-between">
                <div>
                     <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <span class="text-2xl">⏱️</span> Performance de Listas
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">Tempo médio de permanência dos cards</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                ${card(leftId, 'timeTrackingSelectLeft')}
                ${card(rightId, 'timeTrackingSelectRight')}
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
                        <span class="text-4xl">⏱️</span> Análise de Tempos de Saída
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
