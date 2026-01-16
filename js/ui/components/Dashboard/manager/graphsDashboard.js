UI.renderGraphsDashboard = function (state) {
    const rawData = state.rawData;

    return `
        <div class="flex h-screen w-full bg-[#0f172a] font-sans text-gray-100 overflow-hidden relative">
            <!-- SIDEBAR -->
            ${UI.renderSidebarManager(state, state.kpis, state.selectedMemberId)}

            <!-- MAIN CONTENT -->
            <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0f172a] min-w-0">
                <!-- Header -->
                <header class="h-16 bg-[#0f172a]/95 border-b border-gray-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
                    <div>
                         <h1 class="text-xl font-black text-white tracking-tight flex items-center gap-3">
                           <button id="backToDashBtn" class="p-1 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                           </button>
                           Analytics & Gráficos
                           <span class="text-xs font-normal text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Visualização Avançada</span>
                        </h1>
                    </div>
                </header>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-8 custom-scrollbar-dark">
                    
                    <div class="mb-8 p-6 bg-gradient-to-r from-slate-800 to-blue-900/20 rounded-2xl border border-blue-500/10 flex justify-between items-center shadow-lg">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-2">Tendências e Performance</h2>
                            <p class="text-gray-400">Análise profunda de leads, pipeline e equipa.</p>
                        </div>
                    </div>

                    <!-- Grid de Gráficos -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        
                        <!-- Gráfico 1: Tendência (Full Line) -->
                        <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 relative group h-[400px] flex flex-col hover:border-blue-500/20 transition-colors">
                             <h3 class="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span> Fluxo de Entrada (14 Dias)
                             </h3>
                             <div class="flex-1 bg-[#0f172a]/50 rounded-xl border border-gray-700/50 relative overflow-hidden flex items-end p-4">
                                 ${UI.renderLeadTrendChart(rawData?.cards || [])}
                             </div>
                        </div>

                        <!-- Gráfico 2: Distribuição (Donut) -->
                         <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 relative group h-[400px] flex flex-col hover:border-blue-500/20 transition-colors">
                             <h3 class="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Distribuição do Pipeline
                             </h3>
                             <div class="flex-1 bg-[#0f172a]/50 rounded-xl border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
                                  ${UI.renderPipelineDistributionChart(rawData?.listas, rawData?.cards)}
                             </div>
                        </div>
                    </div>

                     <div class="grid grid-cols-1 gap-8 mb-20"> <!-- Added margin-bottom -->
                        <!-- Gráfico 3: Performance Comparativa (Barras) -->
                         <div class="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 relative group h-[450px] flex flex-col">
                             <h3 class="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> Volume de Leads vs Atividade (Consultores)
                             </h3>
                             <div class="flex-1 bg-[#0f172a]/50 rounded-xl border border-gray-700/50 flex items-end justify-center p-6 relative overflow-hidden chart-container">
                                 ${UI.renderTeamPerformanceChart(state.kpis?.geral)}
                             </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    `;
};

// Helper 1: Tendência (Já existente)
UI.renderLeadTrendChart = function (cards) {
    if (!cards || !cards.length) return '<div class="w-full text-center text-gray-500 self-center">Sem dados de leads</div>';
    const days = 14;
    const now = new Date();
    const dayMap = {};
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        const label = d.getDate() + '/' + (d.getMonth() + 1);
        dayMap[dayKey] = { date: dayKey, label: label, count: 0 };
    }
    cards.forEach(card => {
        const createdDate = new Date(1000 * parseInt(card.id.substring(0, 8), 16));
        const dayKey = createdDate.toISOString().split('T')[0];
        if (dayMap[dayKey]) dayMap[dayKey].count++;
    });
    const chartData = Object.values(dayMap);
    const maxVal = Math.max(...chartData.map(d => d.count), 5);
    const width = 1000;
    const height = 300;
    const padding = 40;
    const points = chartData.map((d, i) => {
        const x = (i / (days - 1)) * (width - padding * 2) + padding;
        const y = height - padding - (d.count / maxVal) * (height - padding * 2);
        return { x, y, count: d.count, label: d.label };
    });
    const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ');
    const areaD = `${pathD} L${width - padding},${height - padding} L${padding},${height - padding} Z`;
    return `
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#334155" stroke-width="1" />
            <path d="${areaD}" fill="url(#chartGradient)" />
            <path d="${pathD}" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            ${points.map(p => `
                <g class="group/point">
                    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#0f172a" stroke="#22d3ee" stroke-width="2" class="group-hover/point:r-6 transition-all" />
                    <text x="${p.x}" y="${height - 10}" fill="#94a3b8" font-size="12" text-anchor="middle">${p.label}</text>
                    <g class="opacity-0 group-hover/point:opacity-100 transition-opacity">
                         <rect x="${p.x - 20}" y="${p.y - 35}" width="40" height="25" rx="4" fill="#1e293b" stroke="#334155" />
                         <text x="${p.x}" y="${p.y - 18}" fill="white" font-size="12" font-weight="bold" text-anchor="middle">${p.count}</text>
                    </g>
                </g>
            `).join('')}
        </svg>
    `;
};

// Helper 2: Distribuição Pipeline (Donut)
UI.renderPipelineDistributionChart = function (listas, cards) {
    if (!cards || !listas) return '<div class="text-gray-500">Sem dados</div>';

    // Agrupar contagens
    const distribution = listas.map(lista => {
        const count = cards.filter(c => c.idList === lista.id).length;
        return { name: lista.name, count };
    }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

    if (distribution.length === 0) return '<div class="text-gray-500">Pipeline Vazio</div>';

    const total = distribution.reduce((sum, d) => sum + d.count, 0);
    const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

    // Gerar Slices (SVG Circle Segments)
    let cumulativePercent = 0;
    const radius = 16; // viewBox radius equiv
    const circum = 2 * Math.PI * radius; // ~100.53

    const segments = distribution.map((d, i) => {
        const percent = d.count / total;
        const dashArray = `${percent * circum} ${circum}`;
        const offset = -cumulativePercent * circum;
        cumulativePercent += percent;

        return {
            ...d,
            color: colors[i % colors.length],
            dashArray,
            offset,
            percent: Math.round(percent * 100)
        };
    });

    return `
        <div class="flex flex-col md:flex-row items-center gap-8 w-full h-full p-4">
             <!-- Donut SVG -->
             <div class="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 40 40" class="w-full h-full transform -rotate-90">
                    ${segments.map(s => `
                        <circle cx="20" cy="20" r="${radius}" fill="transparent" stroke="${s.color}" stroke-width="4" 
                                stroke-dasharray="${s.dashArray}" stroke-dashoffset="${s.offset}" class="hover:opacity-80 transition-opacity" />
                    `).join('')}
                    <!-- Inner Text -->
                    <text x="20" y="20" text-anchor="middle" dy="0.3em" fill="white" font-size="8" font-weight="bold" transform="rotate(90 20 20)">${total}</text>
                </svg>
             </div>
             
             <!-- Legend -->
             <div class="flex flex-col gap-2 overflow-y-auto max-h-[300px] w-full custom-scrollbar-dark pr-2">
                ${segments.map(s => `
                    <div class="flex justify-between items-center text-xs border-b border-gray-800 pb-1">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: ${s.color}"></span>
                            <span class="text-gray-300 font-medium truncate max-w-[120px]" title="${s.name}">${s.name}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-white font-bold">${s.count}</span>
                            <span class="text-gray-500 w-8 text-right">${s.percent}%</span>
                        </div>
                    </div>
                `).join('')}
             </div>
        </div>
    `;
};

// Helper 3: Performance de Equipa (Bar Chart: Leads vs Actions)
UI.renderTeamPerformanceChart = function (kpiGeral) {
    if (!kpiGeral || !kpiGeral.consultores) return '<div class="text-gray-500">Sem dados de equipa</div>';

    const data = kpiGeral.consultores
        .map(c => ({
            name: c.nome.split(' ')[0], // Primeiro nome
            leads: c.leads || 0,
            activity: c.acoes || c.comentarios || 0 // Fallback se 'acoes' n estiver definido
        }))
        .sort((a, b) => b.leads - a.leads); // Ordenar por leads (quem tem mais)

    const maxLeads = Math.max(...data.map(d => d.leads), 10);
    const maxActivity = Math.max(...data.map(d => d.activity), 10);

    return `
        <div class="w-full h-full overflow-x-auto">
            <div class="font-bold text-xs text-gray-500 mb-2 flex gap-4 justify-end">
                <span class="flex items-center gap-1"><span class="w-2 h-2 bg-blue-500 rounded-sm"></span> Leads (Total)</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 bg-green-500 rounded-sm"></span> Atividade</span>
            </div>
            
            <div class="flex items-end justify-around gap-4 h-[85%] min-w-[600px] pb-6 px-4 border-b border-gray-700">
                ${data.map(d => {
        const hLeads = (d.leads / maxLeads) * 100;
        const hActivity = (d.activity / maxActivity) * 100;

        return `
                        <div class="flex flex-col items-center gap-1 group relative flex-1">
                            <div class="flex items-end gap-1 h-full w-full justify-center">
                                <!-- Bar Leads -->
                                <div class="w-4 bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all relative group/bar" style="height: ${Math.max(hLeads, 1)}%">
                                    <span class="text-[10px] text-white absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100">${d.leads}</span>
                                </div>
                                <!-- Bar Activity -->
                                <div class="w-4 bg-green-500/80 hover:bg-green-400 rounded-t transition-all relative group/bar" style="height: ${Math.max(hActivity, 1)}%">
                                    <span class="text-[10px] text-white absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100">${d.activity}</span>
                                </div>
                            </div>
                            <span class="text-xs text-gray-400 font-medium mt-2 truncate w-full text-center" title="${d.name}">${d.name}</span>
                            
                            <!-- Tooltip On Hover Member -->
                            <div class="absolute bottom-full mb-2 bg-slate-800 border border-slate-600 p-2 rounded shadow-xl text-xs z-50 w-32 hidden group-hover:block pointer-events-none">
                                <div class="font-bold text-white mb-1 border-b border-slate-600 pb-1">${d.name}</div>
                                <div class="flex justify-between text-blue-300"><span>Leads:</span> <b>${d.leads}</b></div>
                                <div class="flex justify-between text-green-300"><span>Atividade:</span> <b>${d.activity}</b></div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
};
