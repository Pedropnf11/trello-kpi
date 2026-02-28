// Landing Page UI Templates — Premium Dark (KPI Master · Real Estate Edition)
UI.renderLandingPage = function (state) {
    return `
        <div class="min-h-screen bg-[#080c14] text-gray-300 overflow-x-hidden" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
            ${UI.renderLandingNavbar()}
            ${UI.renderLandingHero()}
            ${UI.renderLandingPainPoints()}
            ${UI.renderLandingFeatures()}
            <!-- DOCS SECTION — temporariamente oculta (DB pendente) -->
            ${UI.renderLandingAudience()}
            ${UI.renderLandingProfiles()}
            ${UI.renderLandingCTA()}
            ${UI.renderLandingFooter()}
        </div>
    `;
};

UI.renderLandingAudience = function () {
    const profiles = [
        {
            label: 'Agências Imobiliárias',
            desc: 'Equipas de 3 a 20 consultores que gerem leads no Trello e precisam de visibilidade sobre o pipeline sem Excel ou reuniões de acompanhamento.',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            label: 'Consultores Independentes',
            desc: 'Mediadores a trabalhar sozinhos que querem saber quais os leads a contactar hoje, quais as propostas paradas e como está a correr o mês.',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20'
        },
        {
            label: 'Equipas Comerciais B2B',
            desc: 'Startups e PMEs com pipeline de vendas no Trello que precisam de saber qual o lead mais quente, quem está a produzir e qual a taxa de conversão real.',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20'
        },
        {
            label: 'Account Managers',
            desc: 'Profissionais que gerem um portefólio de clientes no Trello e perdem horas a compilar relatórios semanais manualmente para apresentar à chefia.',
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20'
        },
    ];

    return `
        <section id="audiencia" class="py-20 px-4 bg-[#0b0f19] border-y border-white/[0.04]">
            <div class="max-w-5xl mx-auto">
                <div class="text-center mb-12">
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-3">Para quem é</p>
                    <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Ideal para qualquer equipa<br>que use Trello como CRM</h2>
                    <p class="text-gray-500 text-[15px] max-w-xl mx-auto">O KPI Master não substitui o teu Trello — amplifica-o. Se já organizas leads em quadros Trello, estás a um clique de ter os dados a trabalhar para ti.</p>
                </div>

                <div class="grid sm:grid-cols-2 gap-4 mb-6">
                    ${profiles.map(p => `
                        <div class="bg-[#080c14] border border-white/[0.04] rounded-2xl p-6 flex items-start gap-4 hover:border-white/[0.08] transition-all">
                            <div class="w-10 h-10 rounded-xl ${p.bg} border flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 ${p.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p.icon}"/></svg>
                            </div>
                            <div>
                                <h3 class="text-[14px] font-bold text-white mb-1">${p.label}</h3>
                                <p class="text-[12px] text-gray-500 leading-relaxed">${p.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-[#080c14] border border-white/[0.04] rounded-2xl p-5 flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <p class="text-[13px] text-gray-500 leading-relaxed">Se a tua equipa usa o Trello como <span class="text-white font-semibold">CRM informal</span> — listas como "Lead", "Visita Marcada", "Proposta", "Fecho" — o KPI Master lê esses dados e transforma-os num dashboard de performance em tempo real. <span class="text-gray-400 font-medium">Sem configurações, sem integrações, sem IT.</span></p>
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingNavbar = function () {
    return `
        <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#080c14]/95 backdrop-blur-xl">
            <div class="max-w-6xl mx-auto flex items-center justify-between px-5 h-14">
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[12px] font-black shadow-lg shadow-blue-900/40 ring-1 ring-blue-500/30">K</div>
                    <div>
                        <span class="font-black text-[14px] text-white tracking-wide">KPI Master</span>
                        <span class="text-[10px] text-blue-400 font-bold ml-2 bg-blue-500/10 px-1.5 py-0.5 rounded">Imobiliário</span>
                    </div>
                </div>
                <div class="hidden sm:flex items-center gap-8 text-[13px]">
                    <a href="#features" class="text-gray-500 hover:text-white transition-colors font-medium">Funcionalidades</a>
                    <a href="#docs" class="text-gray-500 hover:text-white transition-colors font-medium">Documentos</a>
                    <a href="#perfis" class="text-gray-500 hover:text-white transition-colors font-medium">Perfis</a>
                </div>
                <button id="navLoginBtn" class="bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-900/30 active:scale-95">
                    Entrar na plataforma →
                </button>
            </div>
        </nav>
    `;
};

UI.renderLandingHero = function () {
    return `
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-14">
            <!-- Ambient glows -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.07] rounded-full blur-[160px] pointer-events-none"></div>
            <div class="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/[0.04] rounded-full blur-[140px] pointer-events-none"></div>

            <div class="relative z-10 max-w-6xl mx-auto text-center w-full">

                <!-- Urgency badge -->
                <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/[0.08] border border-amber-500/20 mb-8 text-[12px] text-amber-400 font-semibold backdrop-blur-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Consultores imobiliários estão a perder leads todos os dias — sem saber.
                </div>

                <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] mb-7 text-white">
                    Os teus leads estão no<br>
                    Trello. Os teus resultados<br>
                    <span class="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">estão a escapar-te.</span>
                </h1>

                <p class="text-[17px] sm:text-xl text-gray-500 max-w-2xl mx-auto mb-5 leading-relaxed font-light">
                    O KPI Master liga-se ao teu Trello e mostra-te em tempo real quais os leads a perder tração, quem da equipa está a produzir e o que tens de fazer agora.
                </p>


                <!-- CTAs -->
                <div class="flex flex-col sm:flex-row gap-3 justify-center mb-16">
                    <button id="heroStartBtn" class="bg-blue-600 text-white rounded-xl px-9 py-4 text-[15px] font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 group active:scale-95">
                        Ligar o meu Trello — é grátis
                        <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </button>
                    <button class="bg-white/[0.04] border border-white/[0.06] text-gray-300 rounded-xl px-9 py-4 text-[15px] font-medium hover:bg-white/[0.07] transition-all">
                        Ver como funciona →
                    </button>
                </div>

                <!-- DASHBOARD MOCKUP -->
                <div class="bg-[#0b0f19] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/[0.03] text-left select-none">
                    <div class="flex h-[520px] overflow-hidden">

                        <!-- SIDEBAR -->
                        <div class="w-[180px] bg-[#080c14] border-r border-white/[0.04] flex flex-col flex-shrink-0">
                            <div class="h-10 flex items-center gap-2 px-3 border-b border-white/[0.04]">
                                <div class="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-[8px] font-black text-white ring-1 ring-blue-500/30">K</div>
                                <span class="text-[11px] font-black text-white">KPI Master</span>
                            </div>
                            <div class="flex-1 py-3 px-2.5 space-y-4 overflow-hidden">
                                <div>
                                    <p class="text-[7px] text-gray-600 font-bold uppercase tracking-[0.15em] mb-2 pl-1">O Meu Perfil</p>
                                    <div class="flex items-center gap-2 px-2 py-1.5 bg-[#0d1117] rounded-lg border border-white/[0.04]">
                                        <div class="w-5 h-5 rounded-md bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[7px] font-bold text-blue-300">RC</div>
                                        <div>
                                            <div class="text-[9px] font-bold text-white">Ricardo C.</div>
                                            <div class="flex items-center gap-1 mt-0.5"><span class="w-1 h-1 rounded-full bg-emerald-500"></span><span class="text-[7px] text-emerald-500 font-semibold">Gestor</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-[7px] text-gray-600 font-bold uppercase tracking-[0.15em] mb-1.5 pl-1">Período</p>
                                    <div class="space-y-1">
                                        <div class="bg-[#0d1117] border border-white/[0.05] rounded-md px-2 py-1 text-[8px] text-gray-500">2025-02-01</div>
                                        <div class="bg-[#0d1117] border border-white/[0.05] rounded-md px-2 py-1 text-[8px] text-gray-500">2025-02-28</div>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-[7px] text-gray-600 font-bold uppercase tracking-[0.15em] mb-1.5 pl-1">Consultores</p>
                                    <div class="space-y-0.5">
                                        <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-600/15 border border-blue-500/20">
                                            <div class="w-4 h-4 rounded-sm bg-white/[0.06] flex items-center justify-center text-[6px] font-bold">ALL</div>
                                            <span class="text-[9px] font-semibold text-white">Todos</span>
                                        </div>
                                        ${['Ana M.', 'Bruno S.', 'Carla F.'].map(n => `<div class="flex items-center gap-1.5 px-2 py-1 rounded-md"><div class="w-4 h-4 rounded-sm bg-[#1a2235] flex items-center justify-center text-[6px] font-bold text-gray-400">${n.substring(0, 2)}</div><span class="text-[9px] text-gray-500">${n}</span></div>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="p-2 border-t border-white/[0.04] space-y-0.5">
                                <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-emerald-600 text-[9px] font-semibold cursor-default">
                                    <div class="w-2.5 h-2.5 rounded-sm bg-emerald-500/10"></div>Scripts Reativação
                                </div>
                                <div class="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-gray-600 text-[9px] font-semibold cursor-default">
                                    <div class="w-2.5 h-2.5 rounded-sm bg-white/[0.03]"></div>Configurações
                                </div>
                            </div>
                        </div>

                        <!-- MAIN -->
                        <div class="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
                            <div class="h-10 bg-[#0f172a] border-b border-white/[0.04] flex items-center justify-between px-4 flex-shrink-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-[12px] font-black text-white">Dashboard Imobiliário</span>
                                    <span class="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Manager</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <div class="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-md"><span class="text-[9px] font-bold text-white">Analytics</span></div>
                                    <div class="flex items-center gap-1 bg-[#111827] border border-white/[0.06] px-2 py-1 rounded-md"><span class="text-[9px] font-bold text-gray-300">Exportar PDF</span></div>
                                </div>
                            </div>

                            <div class="flex-1 overflow-hidden p-3 grid grid-rows-[auto_auto_auto] gap-3">
                                <!-- ROW 1: Pipeline + Focus Zone -->
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="bg-[#0f172a] border border-white/[0.04] rounded-xl p-3">
                                        <div class="flex items-center gap-1.5 mb-2.5">
                                            <div class="w-2 h-2 rounded-sm bg-blue-500"></div>
                                            <span class="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Pipeline Imobiliário</span>
                                        </div>
                                        <div class="space-y-1.5">
                                            ${[
            { s: 'Novo Contacto', pct: 100, n: 52, c: 'bg-gradient-to-r from-blue-600 to-blue-500' },
            { s: 'Visita Marcada', pct: 68, n: 35, c: 'bg-gradient-to-r from-blue-600 to-blue-500' },
            { s: 'Proposta Enviada', pct: 41, n: 21, c: 'bg-gradient-to-r from-blue-600 to-blue-500' },
            { s: 'Contrato Assinado', pct: 15, n: 8, c: 'bg-gradient-to-r from-emerald-600 to-emerald-500' },
        ].map(r => `<div class="flex items-center gap-1.5 text-[8px]"><span class="w-16 text-gray-500 truncate">${r.s}</span><div class="flex-1 h-1 rounded-full bg-white/[0.04]"><div class="h-full rounded-full ${r.c}" style="width:${r.pct}%"></div></div><span class="text-gray-500 w-4 text-right">${r.n}</span></div>`).join('')}
                                        </div>
                                    </div>
                                    <div class="bg-[#0f172a] border border-white/[0.04] rounded-xl p-3">
                                        <div class="flex items-center justify-between mb-2.5">
                                            <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-sm bg-rose-500"></div><span class="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Leads a Perder Tração</span></div>
                                            <span class="text-[7px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">⚠ 5 críticos</span>
                                        </div>
                                        <div class="space-y-1.5">
                                            ${[
            { name: 'Família Mendes — T3 Algés', tag: '🔴 14 dias parado', bg: 'bg-rose-500/[0.05]' },
            { name: 'Dr. Ferreira — Escritório Lisboa', tag: '🟡 8 dias parado', bg: 'bg-amber-500/[0.05]' },
            { name: 'Ana Costa — T2 Cascais', tag: '🟡 6 dias parado', bg: 'bg-amber-500/[0.05]' },
        ].map(a => `<div class="${a.bg} border border-white/[0.03] rounded-lg px-2 py-1 flex items-center justify-between"><span class="text-[8px] text-gray-400 truncate">${a.name}</span><span class="text-[7px] text-gray-600 flex-shrink-0 ml-1">${a.tag}</span></div>`).join('')}
                                        </div>
                                    </div>
                                </div>

                                <!-- ROW 2: Tempo Espera + Atividade -->
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="bg-[#0f172a] border border-white/[0.04] rounded-xl p-3">
                                        <div class="flex items-center gap-1.5 mb-2"><div class="w-2 h-2 rounded-sm bg-amber-500"></div><span class="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Tempo Médio por Fase</span></div>
                                        <div class="grid grid-cols-2 gap-2">
                                            <div class="bg-[#111827] rounded-lg p-2.5 border border-white/[0.04]">
                                                <p class="text-[7px] text-gray-600 uppercase tracking-wider mb-1">Geral</p>
                                                <p class="text-[22px] font-black text-white leading-none">11d</p>
                                                <p class="text-[8px] text-rose-400 mt-0.5">↑ acima do ideal</p>
                                            </div>
                                            <div class="space-y-1">
                                                ${[
            { l: 'Visita → Proposta', t: '7d', c: 'text-rose-400' },
            { l: 'Proposta → Fecho', t: '18d', c: 'text-rose-400' },
            { l: 'Contacto → Visita', t: '4d', c: 'text-emerald-400' },
        ].map(r => `<div class="bg-[#111827] rounded-md px-2 py-1 border border-white/[0.04] flex justify-between items-center"><span class="text-[7px] text-gray-600 truncate">${r.l}</span><span class="text-[8px] font-bold ${r.c}">${r.t}</span></div>`).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-[#0f172a] border border-white/[0.04] rounded-xl p-3">
                                        <div class="flex items-center gap-1.5 mb-2"><div class="w-2 h-2 rounded-sm bg-purple-500"></div><span class="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Performance Consultores</span></div>
                                        <div class="bg-[#111827] border border-amber-500/20 rounded-lg px-2 py-1.5 flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-1.5">
                                                <div class="w-4 h-4 rounded-md bg-amber-500/20 flex items-center justify-center text-[7px] font-bold text-amber-300">AN</div>
                                                <div><p class="text-[8px] font-bold text-white">Ana Martins</p><p class="text-[7px] text-amber-400">🏆 8 contratos este mês</p></div>
                                            </div>
                                            <span class="text-[10px] font-black text-white">42</span>
                                        </div>
                                        <div class="space-y-1">
                                            ${[{ n: 'Bruno S.', v: 31, pct: 74 }, { n: 'Carla F.', v: 22, pct: 52 }, { n: 'David R.', v: 15, pct: 36 }].map(m => `<div class="flex items-center gap-1.5 text-[8px]"><span class="w-12 text-gray-500 truncate">${m.n}</span><div class="flex-1 h-1 rounded-full bg-white/[0.04]"><div class="h-full rounded-full bg-white/20" style="width:${m.pct}%"></div></div><span class="text-gray-500 w-4 text-right">${m.v}</span></div>`).join('')}
                                        </div>
                                    </div>
                                </div>

                                <!-- ROW 3: Tabela -->
                                <div class="bg-[#0f172a] border border-white/[0.04] rounded-xl p-3 overflow-hidden">
                                    <div class="flex items-center gap-1.5 mb-2">
                                        <div class="w-2 h-2 rounded-sm bg-indigo-500"></div>
                                        <span class="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Tabela de Performance — Fevereiro</span>
                                        <div class="ml-auto flex items-center gap-2 text-[7px] text-gray-600">
                                            <span class="bg-[#111827] border border-white/[0.04] px-1.5 py-0.5 rounded">Leads: <span class="text-white font-bold">52</span></span>
                                            <span class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">8 contratos</span>
                                        </div>
                                    </div>
                                    <table class="w-full text-[7px]">
                                        <thead><tr class="border-b border-white/[0.04]">${['Consultor', 'Leads', 'Visitas', 'Propostas', 'Contratos', 'Taxa'].map(h => `<th class="text-left text-gray-600 pb-1.5 font-bold uppercase tracking-wider pr-3">${h}</th>`).join('')}</tr></thead>
                                        <tbody class="divide-y divide-white/[0.03]">
                                            ${[
            { n: 'Ana Martins', l: 42, v: 28, p: 15, c: 8, t: '19%' },
            { n: 'Bruno S.', l: 31, v: 19, p: 11, c: 5, t: '16%' },
            { n: 'Carla F.', l: 22, v: 14, p: 7, c: 3, t: '14%' },
        ].map(r => `<tr><td class="py-1 pr-3 text-gray-300 font-semibold">${r.n}</td><td class="py-1 pr-3"><span class="bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded-full font-bold">${r.l}</span></td><td class="py-1 pr-3 text-gray-500">${r.v}</td><td class="py-1 pr-3 text-gray-500">${r.p}</td><td class="py-1 pr-3 text-emerald-400 font-bold">${r.c}</td><td class="py-1 pr-3 text-amber-400 font-bold">${r.t}</td></tr>`).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingPainPoints = function () {
    const pains = [
        {
            iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            iconColor: 'text-rose-400',
            iconBg: 'bg-rose-500/[0.08] border-rose-500/15',
            pain: 'Leads parados há semanas que nunca chegaste a reativar',
            fix: 'A Focus Zone alerta-te automaticamente com prioridade por dias sem contacto',
        },
        {
            iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-500/[0.08] border-amber-500/15',
            pain: 'Não sabes qual consultor está a produzir e qual está estagnado',
            fix: 'Rankings automáticos com leads, visitas, propostas e contratos por membro',
        },
        {
            iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/[0.08] border-blue-500/15',
            pain: 'Perdes horas a preparar relatórios para reuniões semanais',
            fix: 'PDF/CSV/Email gerado automaticamente com um clique — em segundos',
        },
        {
            iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            iconColor: 'text-purple-400',
            iconBg: 'bg-purple-500/[0.08] border-purple-500/15',
            pain: 'Propostas enviadas que ficam sem follow-up e morrem',
            fix: 'Time Tracking mostra quanto tempo cada lead está parado em "Proposta Enviada"',
        },
    ];

    return `
        <section class="py-20 px-4 bg-[#080c14]">
            <div class="max-w-5xl mx-auto">
                <div class="text-center mb-12">
                    <p class="text-[10px] text-rose-400 font-bold uppercase tracking-[0.2em] mb-3">Reconheces algum destes cenários?</p>
                    <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Os problemas que custam<br>negócios todos os meses</h2>
                    <p class="text-gray-500 text-[15px] max-w-xl mx-auto">Cada lead parado é dinheiro parado. O KPI Master é a ferramenta que faz o aviso antes de ser tarde.</p>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                    ${pains.map(p => `
                        <div class="bg-[#0b0f19] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all">
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-xl ${p.iconBg} border flex items-center justify-center flex-shrink-0">
                                    <svg class="w-5 h-5 ${p.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p.iconPath}"/></svg>
                                </div>
                                <div>
                                    <p class="text-[13px] font-bold text-gray-300 mb-2 leading-snug">${p.pain}</p>
                                    <div class="flex items-start gap-2 mt-3">
                                        <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                        <p class="text-[12px] text-emerald-400/80 leading-relaxed">${p.fix}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingFeatures = function () {
    const features = [
        { title: 'Pipeline Imobiliário em Tempo Real', desc: 'Vê quantos leads estão em cada fase — Contacto, Visita, Proposta, Fecho — e onde estão a perder-se. Atualizado cada vez que mexes no Trello.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', tag: 'Base' },
        { title: 'Alertas de Leads a Arrefecer', desc: 'Quando um lead fica X dias sem movimento, a Focus Zone avisa-te automaticamente. Nunca mais perdes um cliente por falta de follow-up.', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', tag: 'Mais Usado' },
        { title: 'Tempo por Fase do Pipeline', desc: 'Quanto tempo em média fica um lead parado em "Visita Marcada"? O Time Tracking responde. Identifica o gargalo e trata-o antes de perder o cliente.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', tag: '' },
        { title: 'Ranking da Equipa Automático', desc: 'Leads, visitas, propostas e contratos por consultor — numa tabela que se atualiza sozinha. Sem perguntar, sem reuniões de acompanhamento.', icon: 'M3 10h18M3 6h18M3 14h18M3 18h18', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', tag: '' },
        { title: 'Scripts e Documentos de Reativação', desc: 'Acesso a guias de reativação de leads frios, scripts de follow-up por fase e templates de email — criados especificamente para o imobiliário.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', tag: 'Exclusivo' },
        { title: 'Relatórios com Um Clique', desc: 'PDF para apresentar ao diretor, CSV para análise própria, ou email automático toda a segunda-feira. O fim das tardes de domingo a preparar relatórios.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', tag: '' },
        { title: 'Login em 30 Segundos', desc: 'Ligação direta com a tua conta Trello via OAuth. Sem registos, sem passwords novas, sem IT. Ligas e está pronto.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'text-gray-400', bg: 'bg-white/[0.04] border-white/[0.06]', tag: '' },
        { title: 'Vista do Consultor Individual', desc: 'Cada membro da equipa tem a sua própria vista: só o seu pipeline, os seus leads críticos e as suas métricas. Sem ver o que não é seu.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', tag: '' },
        { title: 'Analytics Completo', desc: 'Taxa de conversão real por fase, evolução semanal e dispersão por consultor. Dados que antes demoravam horas a calcular, agora a um olhar.', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', tag: '' },
    ];

    return `
        <section id="features" class="py-24 px-4 bg-[#0b0f19] border-y border-white/[0.04]">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-14">
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-3">O que inclui</p>
                    <h2 class="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight">Construído para imobiliário.<br>Ligado ao teu Trello.</h2>
                    <p class="text-gray-500 text-[15px] max-w-2xl mx-auto">Todas as funcionalidades que uma agência ou consultor independente precisa para não perder leads — sem mudar o que já usa.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${features.map(f => `
                        <div class="bg-[#111827] border border-white/[0.04] p-6 rounded-2xl hover:border-white/[0.08] transition-all group relative">
                            ${f.tag ? `<span class="absolute top-4 right-4 text-[8px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">${f.tag}</span>` : ''}
                            <div class="w-9 h-9 rounded-xl ${f.bg} border flex items-center justify-center ${f.color} mb-4 transition-transform group-hover:scale-105">
                                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${f.icon}"/></svg>
                            </div>
                            <h3 class="font-bold text-[14px] text-white mb-2 leading-snug">${f.title}</h3>
                            <p class="text-[12px] text-gray-500 leading-relaxed">${f.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingDocs = function () {
    const docs = [
        {
            iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
            iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20',
            title: 'Script de Reativação por Telefone',
            desc: 'Guia passo-a-passo para reativar leads frios em 5 minutos de chamada. Com objeções, respostas e próximos passos.',
            badge: 'PDF · 4 páginas', color: 'border-blue-500/20 bg-blue-500/[0.04]', badgeColor: 'text-blue-400 bg-blue-500/10'
        },
        {
            iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20',
            title: 'Templates de Email — 3 Fases',
            desc: '9 emails prontos a enviar: reativação de frios, follow-up pós-visita e proposta sem resposta. Personalizáveis com o nome do lead.',
            badge: 'DOCX · 9 templates', color: 'border-emerald-500/20 bg-emerald-500/[0.04]', badgeColor: 'text-emerald-400 bg-emerald-500/10'
        },
        {
            iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20',
            title: 'Guia de Follow-up Pós-Visita',
            desc: 'O que dizer nas primeiras 24h após uma visita. Sequência de 3 pontos de contacto para transformar interesse em proposta.',
            badge: 'PDF · 6 páginas', color: 'border-purple-500/20 bg-purple-500/[0.04]', badgeColor: 'text-purple-400 bg-purple-500/10'
        },
        {
            iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20',
            title: 'Mensagens WhatsApp para Leads Frios',
            desc: '12 mensagens curtas com alta taxa de resposta para reativar leads sem contacto há 2 ou mais semanas. Tom natural, não invasivo.',
            badge: 'PDF · 12 mensagens', color: 'border-amber-500/20 bg-amber-500/[0.04]', badgeColor: 'text-amber-400 bg-amber-500/10'
        },
    ];

    return `
        <section id="docs" class="py-24 px-4 bg-[#080c14]">
            <div class="max-w-5xl mx-auto">
                <div class="text-center mb-12">
                    <p class="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mb-3">Incluído na plataforma</p>
                    <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Documentos de Reativação<br>de Leads Imobiliários</h2>
                    <p class="text-gray-500 text-[15px] max-w-xl mx-auto">Além do dashboard, tens acesso a uma biblioteca exclusiva de scripts, templates e guias criados para o mercado imobiliário português.</p>
                </div>

                <div class="bg-[#0b0f19] border border-emerald-500/[0.15] rounded-3xl p-8 mb-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-[80px] pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Biblioteca Exclusiva</span>
                                </div>
                                <h3 class="text-xl font-black text-white">Scripts e Templates — Mercado Português</h3>
                                <p class="text-[13px] text-gray-500 mt-1">Criados para o mercado português. Disponíveis dentro da plataforma.</p>
                            </div>
                            <div class="text-right">
                                <p class="text-[28px] font-black text-white">100%</p>
                                <p class="text-[11px] text-emerald-400 font-bold">Incluído · Sem custo extra</p>
                            </div>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-4">
                            ${docs.map(d => `
                                <div class="border ${d.color} rounded-2xl p-5 backdrop-blur-sm">
                                    <div class="flex items-start gap-3">
                                        <div class="w-9 h-9 rounded-xl ${d.iconBg} border flex items-center justify-center flex-shrink-0">
                                            <svg class="w-4 h-4 ${d.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d.iconPath}"/></svg>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-start justify-between gap-2 mb-1">
                                                <h4 class="text-[13px] font-bold text-white leading-snug">${d.title}</h4>
                                                <span class="text-[8px] font-bold ${d.badgeColor} px-1.5 py-0.5 rounded flex-shrink-0">${d.badge}</span>
                                            </div>
                                            <p class="text-[11px] text-gray-500 leading-relaxed">${d.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <p class="text-center text-[12px] text-gray-600">Novos documentos adicionados regularmente. Membros da plataforma têm acesso automático a todas as atualizações.</p>
            </div>
        </section>
    `;
};

UI.renderLandingProfiles = function () {
    return `
        <section id="perfis" class="py-24 px-4 bg-[#0b0f19] border-y border-white/[0.04]">
            <div class="max-w-5xl mx-auto">
                <div class="text-center mb-14">
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-3">Para quem é</p>
                    <h2 class="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight">Feito para o imobiliário.<br>Para todos os papéis.</h2>
                    <p class="text-gray-500 text-[15px] max-w-xl mx-auto">O teu cargo define o que vês. Sem informação a mais, sem confusão. Só o que precisas para agir.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Director / Gestor -->
                    <div class="bg-[#080c14] border border-blue-500/20 p-8 rounded-2xl text-left relative overflow-hidden group hover:border-blue-500/35 transition-all">
                        <div class="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                            <svg class="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-white">Diretor / Gestor</h3>
                                <span class="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Visão completa da agência</span>
                            </div>
                        </div>
                        <p class="text-[13px] text-gray-500 mb-6 leading-relaxed">Chega de perguntar à equipa como estão os números. Abre o dashboard de manhã e já sabes quem precisa de suporte, qual o lead mais crítico e qual o consultor do mês.</p>
                        <ul class="space-y-3">
                            ${[
            'Pipeline completo da agência por fase e por consultor',
            'Ranking automático — sem Excel, sem cálculos manuais',
            'Alertas de leads críticos antes de se perderem definitivamente',
            'Relatório semanal PDF automático para reuniões',
            'Taxa de conversão real por fase e por elemento da equipa',
        ].map(f => `<li class="flex items-start gap-2.5 text-[13px] text-gray-400"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Consultor -->
                    <div class="bg-[#080c14] border border-emerald-500/20 p-8 rounded-2xl text-left relative overflow-hidden group hover:border-emerald-500/35 transition-all">
                        <div class="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                            <svg class="w-32 h-32 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-white">Consultor Imobiliário</h3>
                                <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Foco nos teus próprios números</span>
                            </div>
                        </div>
                        <p class="text-[13px] text-gray-500 mb-6 leading-relaxed">Entras e sabes o que fazer hoje. Quais os leads a contactar, quais as propostas sem resposta e como estás a correr este mês — sem perguntar ao diretor.</p>
                        <ul class="space-y-3">
                            ${[
            'O teu pipeline pessoal — fase a fase, lead a lead',
            'Focus Zone: o sistema diz-te quem contactar hoje',
            'Os teus contratos e taxa de conversão vs. mês anterior',
            'Alertas para leads que arrefecem dentro do teu portefólio',
            'Acesso direto aos scripts de reativação quando precisas',
        ].map(f => `<li class="flex items-start gap-2.5 text-[13px] text-gray-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5"></span>${f}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingCTA = function () {
    return `
        <section id="cta" class="py-24 px-4 bg-[#080c14]">
            <div class="max-w-3xl mx-auto relative">
                <div class="absolute inset-0 bg-blue-600/[0.05] rounded-3xl blur-2xl pointer-events-none"></div>
                <div class="relative bg-[#0b0f19] border border-white/[0.06] p-10 sm:p-16 rounded-3xl text-center overflow-hidden">
                    <!-- Top glow accent -->
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-4">Começa hoje · É grátis</p>
                    <h2 class="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight leading-tight">O teu Trello já tem os dados.<br>O que falta são os alertas.</h2>
                    <p class="text-gray-500 text-[15px] mb-3 max-w-xl mx-auto leading-relaxed">Conecta o teu quadro Trello agora — em menos de 2 minutos tens o pipeline ativo, os leads críticos identificados e os scripts de reativação disponíveis.</p>
                    <p class="text-[13px] text-gray-600 mb-10 max-w-md mx-auto font-medium">Sem Excel. Sem configurações. Sem IT. Só o teu Trello, transformado numa máquina de não perder leads.</p>

                    <button id="ctaStartBtn" class="bg-blue-600 text-white rounded-xl px-10 py-4 text-[16px] font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 hover:-translate-y-0.5 transform inline-flex items-center gap-2 group mb-6 active:scale-95">
                        Ligar o meu Trello — é grátis
                        <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </button>

                    <div class="flex items-center justify-center gap-6 text-[11px] text-gray-600 flex-wrap">
                        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-emerald-500"></span>100% gratuito</span>
                        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-emerald-500"></span>Sem cartão de crédito</span>
                        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-emerald-500"></span>Liga em 2 minutos</span>
                        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-emerald-500"></span>Scripts de reativação incluídos</span>
                    </div>
                </div>
            </div>
        </section>
    `;
};

UI.renderLandingFooter = function () {
    return `
        <footer class="border-t border-white/[0.04] py-10 px-4 bg-[#080c14]">
            <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[10px] font-black text-white">K</div>
                    <div>
                        <span class="text-[13px] font-black text-gray-400">KPI Master</span>
                        <span class="text-[10px] text-blue-400 font-bold ml-2">Imobiliário</span>
                    </div>
                </div>
                <p class="text-[12px] text-gray-600">© ${new Date().getFullYear()} KPI Master. Feito para consultores imobiliários que usam Trello.</p>
                <div class="flex items-center gap-6 text-[12px] text-gray-600">
                    <a href="#" class="hover:text-gray-300 transition-colors">Privacidade</a>
                    <a href="#" class="hover:text-gray-300 transition-colors">Termos</a>
                    <a href="#" class="hover:text-gray-300 transition-colors">Contacto</a>
                </div>
            </div>
        </footer>
    `;
};
