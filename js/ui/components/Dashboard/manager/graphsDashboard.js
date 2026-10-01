UI.renderGraphsDashboard = function (state) {
    const rawData = state.rawData || {};
    const cards = rawData.cards || [];
    const listas = rawData.listas || [];
    const consultores = state.kpis?.geral?.consultores || [];

    const totalActions = consultores.reduce((sum, c) => sum + (c.acoes || c.comentarios || 0), 0);

    return `
        <div class="flex h-screen w-full bg-[#080c14] font-sans text-gray-100 overflow-hidden relative">
            <!-- SIDEBAR -->
            ${UI.renderSidebarManager(state, state.kpis, state.selectedMemberId)}

            <!-- MAIN CONTENT -->
            <main class="flex-1 flex flex-col h-full relative overflow-hidden bg-[#080c14] min-w-0">
                <!-- Header -->
                <header class="h-16 bg-[#080c14]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-6 z-30 flex-shrink-0">
                    <div class="flex items-center gap-4">
                        <button id="backToDashBtn" class="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] hover:bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            <span>Voltar ao Dashboard</span>
                        </button>
                        <div class="h-4 w-[1px] bg-white/10"></div>
                        <h1 class="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                            <span class="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-gray-400">Analytics & Gráficos</span>
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Visualização Avançada
                            </span>
                        </h1>
                    </div>
                </header>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar-dark space-y-6">
                    
                    <!-- Resumo executivo (4 Cards de KPI) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/30 transition-all shadow-lg">
                            <div class="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total de Cards</p>
                                <p class="text-2xl font-extrabold text-white mt-0.5">${cards.length}</p>
                            </div>
                        </div>

                        <div class="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-all shadow-lg">
                            <div class="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Etapas Pipeline</p>
                                <p class="text-2xl font-extrabold text-white mt-0.5">${listas.length}</p>
                            </div>
                        </div>

                        <div class="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-all shadow-lg">
                            <div class="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Membros Equipa</p>
                                <p class="text-2xl font-extrabold text-white mt-0.5">${consultores.length}</p>
                            </div>
                        </div>

                        <div class="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/30 transition-all shadow-lg">
                            <div class="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Atividade Total</p>
                                <p class="text-2xl font-extrabold text-white mt-0.5">${totalActions}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Grid de Gráficos Superiores -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <!-- Gráfico 1: Tendência (Full Line) -->
                        <div class="bg-[#0d1117] rounded-2xl p-6 border border-white/[0.08] relative group h-[420px] flex flex-col hover:border-blue-500/30 transition-all shadow-xl">
                            <div class="flex items-center justify-between mb-5">
                                <div>
                                    <h3 class="text-[15px] font-bold text-white flex items-center gap-2.5">
                                        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>
                                        Fluxo de Entrada (14 Dias)
                                    </h3>
                                    <p class="text-[11px] text-gray-400 mt-0.5 pl-5">Evolução diária de novas criações no quadro</p>
                                </div>
                            </div>
                            <div class="flex-1 bg-[#080c14] rounded-xl border border-white/[0.04] relative overflow-hidden flex items-end p-4">
                                ${UI.renderLeadTrendChart(rawData?.cards || [])}
                            </div>
                        </div>

                        <!-- Gráfico 2: Distribuição (Donut) -->
                        <div class="bg-[#0d1117] rounded-2xl p-6 border border-white/[0.08] relative group h-[420px] flex flex-col hover:border-purple-500/30 transition-all shadow-xl">
                            <div class="flex items-center justify-between mb-5">
                                <div>
                                    <h3 class="text-[15px] font-bold text-white flex items-center gap-2.5">
                                        <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"></span>
                                        Distribuição do Pipeline
                                    </h3>
                                    <p class="text-[11px] text-gray-400 mt-0.5 pl-5">Proporção de cards por lista/estágio</p>
                                </div>
                            </div>
                            <div class="flex-1 bg-[#080c14] rounded-xl border border-white/[0.04] flex items-center justify-center relative overflow-hidden p-4">
                                ${UI.renderPipelineDistributionChart(rawData?.listas, rawData?.cards)}
                            </div>
                        </div>
                    </div>

                    <!-- Gráfico Inferior: Performance Comparativa -->
                    <div class="bg-[#0d1117] rounded-2xl p-6 border border-white/[0.08] relative group flex flex-col hover:border-emerald-500/30 transition-all shadow-xl mb-12">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 class="text-[15px] font-bold text-white flex items-center gap-2.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
                                    Volume de Leads vs Atividade por Consultor
                                </h3>
                                <p class="text-[11px] text-gray-400 mt-0.5 pl-5">Comparativo de atribuição de tarefas e participação da equipa</p>
                            </div>
                            
                            <!-- Filtro de Período Personalizado -->
                            <div class="relative flex items-center">
                                <select id="activityPeriodFilter" class="appearance-none bg-[#080c14] border border-white/[0.1] text-gray-200 text-xs font-semibold py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/[0.04] transition-all">
                                    <option value="7">Últimos 7 dias</option>
                                    <option value="30">Últimos 30 dias</option>
                                    <option value="90">Últimos 90 dias</option>
                                </select>
                                <div class="absolute right-2.5 pointer-events-none text-gray-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div id="teamPerformanceChartContainer" class="bg-[#080c14] rounded-xl border border-white/[0.04] flex items-end justify-center p-6 relative overflow-hidden min-h-[360px]">
                            ${UI.renderTeamPerformanceChart(state.kpis?.geral, rawData, '7')}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    `;
};

// Helper 1: Tendência (SVG Line with Glow & Area)
UI.renderLeadTrendChart = function (cards) {
    if (!cards || !cards.length) return '<div class="w-full text-center text-gray-500 self-center text-xs">Sem dados de cards disponíveis</div>';
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
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
            <path d="${areaD}" fill="url(#chartGradient)" />
            <path d="${pathD}" fill="none" stroke="#60a5fa" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />
            ${points.map(p => `
                <g class="group/point">
                    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#0d1117" stroke="#60a5fa" stroke-width="2.5" class="group-hover/point:r-7 transition-all cursor-pointer" />
                    <text x="${p.x}" y="${height - 12}" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">${p.label}</text>
                    <g class="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                         <rect x="${p.x - 24}" y="${p.y - 38}" width="48" height="26" rx="8" fill="#161b22" stroke="rgba(255,255,255,0.15)" />
                         <text x="${p.x}" y="${p.y - 21}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">${p.count}</text>
                    </g>
                </g>
            `).join('')}
        </svg>
    `;
};

// Helper 2: Distribuição Pipeline (Donut SVG + Modern Progress Legend)
UI.renderPipelineDistributionChart = function (listas, cards) {
    if (!cards || !listas) return '<div class="text-gray-500 text-xs">Sem dados disponíveis</div>';

    const distribution = listas.map(lista => {
        const count = cards.filter(c => c.idList === lista.id).length;
        return { name: lista.name, count };
    }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

    if (distribution.length === 0) return '<div class="text-gray-500 text-xs">Pipeline Vazio</div>';

    const total = distribution.reduce((sum, d) => sum + d.count, 0);
    const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

    let cumulativePercent = 0;
    const radius = 16;
    const circum = 2 * Math.PI * radius;

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
        <div class="flex flex-col md:flex-row items-center gap-6 w-full h-full p-2">
             <!-- Donut SVG -->
             <div class="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 40 40" class="w-full h-full transform -rotate-90">
                    ${segments.map(s => `
                        <circle cx="20" cy="20" r="${radius}" fill="transparent" stroke="${s.color}" stroke-width="4.5" 
                                stroke-dasharray="${s.dashArray}" stroke-dashoffset="${s.offset}" class="hover:opacity-80 transition-opacity cursor-pointer" />
                    `).join('')}
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span class="text-2xl font-black text-white leading-none">${total}</span>
                    <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">Cards</span>
                </div>
             </div>
             
             <!-- Legend -->
             <div class="flex flex-col gap-2.5 overflow-y-auto max-h-[280px] w-full custom-scrollbar-dark pr-2">
                ${segments.map(s => `
                    <div class="flex flex-col gap-1 bg-[#0d1117] p-2.5 rounded-xl border border-white/[0.04] hover:border-white/[0.1] transition-all">
                        <div class="flex justify-between items-center text-xs">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${s.color}; box-shadow: 0 0 8px ${s.color}66"></span>
                                <span class="text-gray-200 font-semibold truncate text-[12px]" title="${s.name}">${s.name}</span>
                            </div>
                            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span class="text-white font-bold text-[12px]">${s.count}</span>
                                <span class="text-gray-400 text-[11px] font-medium bg-white/[0.06] px-1.5 py-0.5 rounded-md">${s.percent}%</span>
                            </div>
                        </div>
                        <div class="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mt-1">
                            <div class="h-full rounded-full transition-all duration-500" style="width: ${s.percent}%; background-color: ${s.color}"></div>
                        </div>
                    </div>
                `).join('')}
             </div>
        </div>
    `;
};

// Helper 3: Performance de Equipa (Bar Chart: Leads vs Actions)
UI.renderTeamPerformanceChart = function (kpiGeral, rawData, days = null) {
    if (!kpiGeral || !kpiGeral.consultores) return '<div class="text-gray-500 text-xs self-center">Sem dados de equipa</div>';

    if (!rawData || !days) {
        const data = kpiGeral.consultores
            .map(c => ({
                name: c.nome.split(' ')[0],
                leads: c.leads || 0,
                activity: c.acoes || c.comentarios || 0
            }))
            .sort((a, b) => b.leads - a.leads);

        return UI.generateBarChartHTML(data);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const filteredLeadsCount = {};
    if (rawData.cards) {
        rawData.cards.forEach(card => {
            const createdDate = new Date(1000 * parseInt(card.id.substring(0, 8), 16));
            if (createdDate >= cutoffDate) {
                const memberId = card.idMembers && card.idMembers.length > 0 ? card.idMembers[0] : 'unassigned';
                if (!filteredLeadsCount[memberId]) filteredLeadsCount[memberId] = 0;
                filteredLeadsCount[memberId]++;
            }
        });
    }

    const data = kpiGeral.consultores.map(c => {
        const leadsCount = filteredLeadsCount[c.id] || 0;
        let activityCount = 0;
        if (rawData.actions) {
            activityCount = rawData.actions.filter(a => a.idMemberCreator === c.id && new Date(a.date) >= cutoffDate).length;
        } else {
            activityCount = c.acoes;
        }

        return {
            name: c.nome.split(' ')[0],
            leads: leadsCount,
            activity: activityCount
        };
    }).sort((a, b) => b.leads - a.leads);

    return UI.generateBarChartHTML(data);
};

UI.generateBarChartHTML = function (data) {
    if (!data || !data.length) return '<div class="text-gray-500 text-xs self-center">Sem dados de membros</div>';

    const maxLeads = Math.max(...data.map(d => d.leads), 5);
    const maxActivity = Math.max(...data.map(d => d.activity), 5);

    return `
        <div class="w-full h-full flex flex-col justify-between">
            <div class="flex items-center gap-5 justify-end mb-4">
                <span class="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    <span class="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md"></span> Leads
                </span>
                <span class="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    <span class="w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md"></span> Atividade
                </span>
            </div>
            
            <div class="flex items-end justify-around gap-4 h-[240px] w-full pb-4 px-2 border-b border-white/[0.06]">
                ${data.map(d => {
                    const hLeads = (d.leads / maxLeads) * 100;
                    const hActivity = (d.activity / maxActivity) * 100;

                    return `
                        <div class="flex flex-col items-center gap-2 group relative flex-1 h-full justify-end">
                            <div class="flex items-end gap-1.5 h-full w-full justify-center">
                                <!-- Bar Leads -->
                                <div class="w-5 bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 rounded-t-lg transition-all relative group/bar shadow-[0_0_12px_rgba(59,130,246,0.3)]" style="height: ${Math.max(hLeads, 4)}%">
                                    <div class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-[#161b22] border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg z-20">
                                        ${d.leads}
                                    </div>
                                </div>
                                <!-- Bar Activity -->
                                <div class="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 rounded-t-lg transition-all relative group/bar shadow-[0_0_12px_rgba(16,185,129,0.3)]" style="height: ${Math.max(hActivity, 4)}%">
                                    <div class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-[#161b22] border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg z-20">
                                        ${d.activity}
                                    </div>
                                </div>
                            </div>
                            <span class="text-[11px] text-gray-400 font-semibold truncate w-full text-center" title="${d.name}">${d.name}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
};
