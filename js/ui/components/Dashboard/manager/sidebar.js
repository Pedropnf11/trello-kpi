// ========================================
// SIDEBAR MANAGER COMPONENT
// ========================================
UI.renderSidebarManager = function (state, kpis, filterId) {
    const currentUser = state.currentUser || { fullName: 'Gestor', username: 'Me' };
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;

    return `
        <!-- OVERLAY MOBILE (Manager) -->
        <div id="managerSidebarOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden md:hidden glass-effect" onclick="document.getElementById('managerSidebar').classList.add('-translate-x-full'); document.getElementById('managerSidebarOverlay').classList.add('hidden');"></div>

        <aside id="managerSidebar" class="fixed inset-y-0 left-0 w-[260px] bg-[#080c14] text-gray-400 flex flex-col h-full z-50 border-r border-white/[0.04] transition-transform duration-300 transform -translate-x-full md:translate-x-0 md:relative md:flex shadow-2xl md:shadow-none">

            <!-- Logo Header -->
            <div class="h-14 flex items-center justify-between px-5 border-b border-white/[0.04] flex-shrink-0">
               <div class="flex items-center gap-3">
                   <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shadow-lg shadow-blue-900/40 ring-1 ring-blue-500/30">K</div>
                   <span class="font-bold text-[13px] text-white tracking-wide">KPI Master</span>
               </div>
               <!-- MOBILE CLOSE BUTTON -->
               <button class="md:hidden text-gray-600 hover:text-white transition-colors" onclick="document.getElementById('managerSidebar').classList.add('-translate-x-full'); document.getElementById('managerSidebarOverlay').classList.add('hidden');">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>

            <!-- Scrollable content -->
            <div class="flex-1 overflow-y-auto py-5 px-4 space-y-6 custom-scrollbar-dark">

                <!-- PERFIL -->
                <div>
                    <p class="text-[9px] text-gray-600 font-bold uppercase tracking-[0.15em] mb-3 pl-1">${t('O Meu Perfil', 'My Profile')}</p>
                    <div class="flex items-center gap-3 px-3 py-2.5 bg-[#0d1117] rounded-xl border border-white/[0.04]">
                        <div class="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[11px] font-bold text-blue-300 flex-shrink-0">
                            ${currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : 'ME'}
                        </div>
                        <div class="overflow-hidden min-w-0">
                            <div class="text-[13px] font-bold text-white truncate" title="${Utils.escapeHtmlAttribute(currentUser.fullName)}">${Utils.escapeHtml(currentUser.fullName)}</div>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span class="text-[10px] text-emerald-500 font-semibold">${t('Conectado', 'Connected')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PERÍODO -->
                <div>
                    <p class="text-[9px] text-gray-600 font-bold uppercase tracking-[0.15em] mb-3 pl-1">${t('Período', 'Period')}</p>
                    <div class="space-y-2">
                        <input type="date" id="startDate" value="${state.startDate || ''}" class="w-full bg-[#0d1117] border border-white/[0.05] rounded-lg px-3 py-2 text-[12px] text-gray-300 focus:outline-none focus:border-blue-500/40 focus:ring-0 transition-colors">
                        <input type="date" id="endDate" value="${state.endDate || ''}" class="w-full bg-[#0d1117] border border-white/[0.05] rounded-lg px-3 py-2 text-[12px] text-gray-300 focus:outline-none focus:border-blue-500/40 focus:ring-0 transition-colors">
                        ${(state.startDate || state.endDate) ? `<button id="clearDates" class="w-full text-[11px] text-rose-500/80 hover:text-rose-400 py-1 font-semibold transition-colors">${t('Limpar datas', 'Clear dates')}</button>` : ''}
                    </div>
                </div>

                <!-- EQUIPA -->
                <div>
                    <div class="flex items-center justify-between mb-3 pl-1 cursor-pointer" onclick="document.getElementById('teamList').classList.toggle('hidden'); document.getElementById('teamArrow').classList.toggle('rotate-180')">
                        <p class="text-[9px] text-gray-600 font-bold uppercase tracking-[0.15em] cursor-pointer">${t('Equipa', 'Team')}</p>
                        <svg id="teamArrow" class="w-3.5 h-3.5 text-gray-600 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>

                    <div id="teamList" class="space-y-1">
                        <button class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${!filterId ? 'bg-blue-600/15 text-white border border-blue-500/20' : 'hover:bg-white/[0.03] hover:text-white text-gray-500'}"
                             onclick="document.getElementById('memberFilter').value=''; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                            <div class="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[9px] font-bold flex-shrink-0">ALL</div>
                            <span class="text-[12px] font-semibold">${t('Todos', 'All')}</span>
                        </button>
                        ${kpis.geral.consultores.map(c => `
                            <button class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${c.id === filterId ? 'bg-white/[0.05] text-white border border-white/[0.06]' : 'hover:bg-white/[0.03] hover:text-white text-gray-500'}"
                                 onclick="document.getElementById('memberFilter').value='${c.id}'; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                                 <div class="w-6 h-6 rounded-md bg-[#1a2235] flex items-center justify-center text-[9px] font-bold uppercase text-gray-400 flex-shrink-0">${c.nome.substring(0, 2)}</div>
                                <span class="text-[12px] font-semibold truncate">${c.nome}</span>
                            </button>
                        `).join('')}
                    </div>
                    <select id="memberFilter" class="hidden"><option value="">${t('Todos', 'All')}</option>${kpis.geral.consultores.map(c => `<option value="${c.id}" ${c.id === filterId ? 'selected' : ''}>${c.nome}</option>`).join('')}</select>
                </div>

            </div>

            <!-- Bottom nav actions -->
            <div class="p-4 border-t border-white/[0.04] flex flex-col gap-1 flex-shrink-0">
                <button onclick="document.getElementById('docsComingSoonPopup').classList.remove('hidden')" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/[0.05] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 text-gray-600 group-hover:text-amber-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>${t('Documentos de Ajuda', 'Help Documents')}</span>
                    <span class="ml-auto text-[8px] font-bold text-amber-500/70 bg-amber-500/[0.08] border border-amber-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">${t('Em breve', 'Coming soon')}</span>
                </button>
                <button id="tutorialBtn" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/[0.05] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <span>${t('Tutorial', 'Tutorial')}</span>
                </button>
                <button id="settingsBtn" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 flex-shrink-0 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>${t('Configurações', 'Settings')}</span>
                </button>
                <div class="h-px bg-white/[0.04] my-1"></div>
                <button id="configBtn" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/[0.05] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-0.5 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>${t('Sair', 'Sign out')}</span>
                </button>
            </div>
        </aside>

        <!-- DOCS COMING SOON POPUP -->
        <div id="docsComingSoonPopup" class="hidden fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onclick="if(event.target===this)this.classList.add('hidden')">
            <div class="bg-[#0b0f19] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative">
                <button onclick="document.getElementById('docsComingSoonPopup').classList.add('hidden')" class="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="w-14 h-14 bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h3 class="text-[17px] font-black text-white mb-2">${t('Scripts e Documentos', 'Scripts & Documents')}</h3>
                <p class="text-[13px] text-gray-500 leading-relaxed mb-6">${t('Esta funcionalidade está em desenvolvimento. Em breve terás acesso a scripts de reativação, templates de email e guiões de vendas diretamente aqui.', 'This feature is in development. Soon you\'ll have access to reactivation scripts, email templates and sales playbooks directly here.')}</p>
                <div class="flex items-center justify-center gap-2 text-[11px] text-amber-400 font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    ${t('Nova funcionalidade a caminho', 'New feature coming soon')}
                </div>
            </div>
        </div>


        <!-- TUTORIAL MODAL -->
        <div id="tutorialModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div class="bg-[#0b0f19] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/[0.06] flex flex-col overflow-hidden max-h-[90vh]">
                <!-- Header -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-white/[0.04] bg-[#080c14] flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                        </div>
                        <div>
                            <h2 class="text-[14px] font-bold text-white">${t('Tutorial & Ajuda', 'Tutorial & Help')}</h2>
                            <p class="text-[11px] text-gray-600">${t('Como usar a aplicação.', 'How to use the app.')}</p>
                        </div>
                    </div>
                    <button id="closeTutorialBtn" class="text-gray-600 hover:text-white transition-colors bg-white/[0.04] p-1.5 rounded-lg hover:bg-white/[0.08]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-white/[0.04] bg-[#080c14] flex-shrink-0">
                    <button class="tutorial-tab-btn flex-1 py-3 text-[12px] font-bold text-blue-400 border-b-2 border-blue-500 transition-colors" data-tab="exportar">${t('Exportação', 'Export')}</button>
                    <button class="tutorial-tab-btn flex-1 py-3 text-[12px] font-bold text-gray-500 hover:text-gray-300 border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="filtros">${t('Filtros & Datas', 'Filters & Dates')}</button>
                    <button class="tutorial-tab-btn flex-1 py-3 text-[12px] font-bold text-gray-500 hover:text-gray-300 border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="geral">${t('Geral', 'General')}</button>
                </div>

                <!-- Content Area -->
                <div class="p-6 overflow-y-auto bg-[#0b0f19] flex-1 custom-scrollbar-dark">

                    <!-- TAB: EXPORTAR -->
                    <div id="tab-content-exportar" class="tab-content block">
                        <h3 class="text-[13px] font-bold text-white mb-3">${t('Como Exportar?', 'How to Export?')}</h3>
                        <p class="text-[12px] text-gray-400 mb-4 leading-relaxed">
                            ${t('Para exportares os teus dados, clica no botão', 'To export your data, click the')} <span class="text-white font-semibold">"${t('Exportar', 'Export')}"</span> ${t('no topo superior direito.', 'button in the top right.')}
                        </p>
                        <ul class="space-y-2 mb-5">
                            <li class="flex items-start gap-2.5 text-[12px] text-gray-500">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                <span><strong class="text-gray-300">PDF:</strong> ${t('Relatório visual completo, ideal para apresentações.', 'Full visual report, ideal for presentations.')}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-[12px] text-gray-500">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                <span><strong class="text-gray-300">CSV:</strong> ${t('Dados brutos para Excel ou Google Sheets.', 'Raw data for Excel or Google Sheets.')}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-[12px] text-gray-500">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                <span><strong class="text-gray-300">Email:</strong> ${t('Envia o relatório para a tua equipa via Webhook.', 'Send the report to your team via Webhook.')}</span>
                            </li>
                        </ul>
                        <div class="bg-blue-500/[0.06] p-3.5 rounded-xl border border-blue-500/15">
                            <p class="text-[11px] text-blue-400/80">💡 ${t('Para enviar por email, configura primeiro o Webhook nas definições.', 'To send by email, first configure the Webhook in settings.')}</p>
                        </div>
                    </div>

                    <!-- TAB: FILTROS -->
                    <div id="tab-content-filtros" class="tab-content hidden">
                        <h3 class="text-[13px] font-bold text-white mb-3">${t('Como criar um Webhook', 'How to set up a Webhook')}</h3>
                        <p class="text-[12px] text-gray-400 mb-4 leading-relaxed">
                            ${t('Podes personalizar a visualização usando a barra lateral esquerda.', 'You can customise the view using the left sidebar.')}
                        </p>
                        <div class="space-y-4">
                            <div class="flex gap-3 items-start">
                                <div class="w-7 h-7 rounded-lg bg-[#1a2235] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">1</div>
                                <div>
                                    <h4 class="text-[12px] font-bold text-gray-200 mb-0.5">${t('Cria conta no Make.com ou Zapier', 'Create an account on Make.com or Zapier')}</h4>
                                    <p class="text-[11px] text-gray-500">${t('Plataformas de automação gratuitas com plano básico.', 'Free automation platforms with a basic plan.')}</p>
                                </div>
                            </div>
                            <div class="flex gap-3 items-start">
                                <div class="w-7 h-7 rounded-lg bg-[#1a2235] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">2</div>
                                <div>
                                    <h4 class="text-[12px] font-bold text-gray-200 mb-0.5">${t('Cria a tua template com Webhook + Gmail', 'Set up your template with Webhook + Gmail')}</h4>
                                    <p class="text-[11px] text-gray-500 mb-2">${t('Usa os templates prontos abaixo para começar:', 'Use the ready-made templates below to get started:')}</p>
                                    <div class="bg-[#0d1117] p-3 rounded-xl border border-white/[0.04] space-y-1.5">
                                        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-wider mb-2">${t('Templates Prontos:', 'Ready Templates:')}</p>
                                        <a href="https://eu1.make.com/public/shared-scenario/sYmeIcy6C7x/integration-webhooks-gmail-corrected" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors truncate">
                                            <span class="text-blue-500/50">🔗</span> Make.com: Webhook → Gmail (${t('Simples', 'Basic')})
                                        </a>
                                        <a href="https://eu1.make.com/public/shared-scenario/sYmeIcy6C7x/integration-webhooks-gmail-corrected" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors truncate">
                                            <span class="text-blue-500/50">🔗</span> Make.com: Webhook → Gmail (${t('Avançado', 'Advanced')})
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- SETTINGS MODAL -->
        <div id="settingsModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div class="bg-[#0b0f19] w-full max-w-md rounded-2xl shadow-2xl border border-white/[0.06] overflow-hidden">
                <div class="flex justify-between items-center px-6 py-4 border-b border-white/[0.04] bg-[#080c14]">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <h2 class="text-[14px] font-bold text-white">${t('Configurações', 'Settings')}</h2>
                    </div>
                    <button id="closeSettingsBtn" class="text-gray-600 hover:text-white transition-colors bg-white/[0.04] p-1.5 rounded-lg hover:bg-white/[0.08]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 space-y-4 bg-[#0b0f19]">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">${t('Webhook URL (Relatórios)', 'Webhook URL (Reports)')}</label>
                        <input type="text" id="dashboardWebhookUrl" value="${state.webhookUrl || ''}" placeholder="https://hook.make.com/..." class="w-full bg-[#0d1117] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/40 focus:ring-0 transition-colors">
                        <p class="text-[11px] text-gray-600 mt-2">${t('Cola aqui o teu Webhook do Make/Zapier para receberes os relatórios por email.', 'Paste your Make/Zapier Webhook here to receive reports by email.')}</p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-white/[0.04] bg-[#080c14] flex justify-end">
                    <button id="saveSettingsBtn" class="bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold py-2 px-5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        ${t('Guardar Alterações', 'Save Changes')}
                    </button>
                </div>
            </div>
        </div>

        <!-- LOGOUT MODAL -->
        <div id="logoutModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div class="bg-[#0b0f19] w-full max-w-sm rounded-2xl shadow-2xl border border-white/[0.06] p-6 flex flex-col gap-3">
                <div class="text-center mb-1">
                    <div class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 text-gray-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </div>
                    <h3 class="text-[14px] font-bold text-white">${t('O que pretendes fazer?', 'What would you like to do?')}</h3>
                    <p class="text-[11px] text-gray-600 mt-1">${t('Escolhe uma opção abaixo', 'Choose an option below')}</p>
                </div>

                <button id="changeBoardBtn" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-[12px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                     ${t('Trocar de Quadro / Função', 'Switch Board / Role')}
                </button>

                <button id="confirmLogoutBtn" class="w-full py-2.5 px-4 bg-rose-500/8 hover:bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     ${t('Terminar Sessão', 'Sign Out')}
                </button>

                <button id="cancelLogoutBtn" class="w-full py-2 text-gray-600 hover:text-gray-300 text-[11px] font-medium transition-colors">
                    ${t('Cancelar', 'Cancel')}
                </button>
            </div>
        </div>
    `;
};
