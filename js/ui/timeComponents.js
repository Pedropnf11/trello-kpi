UI.renderTimeTracking = function (temposListas) {
    return `
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
