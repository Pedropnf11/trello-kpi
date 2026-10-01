// ========================================
// SIDEBAR SALES COMPONENT
// ========================================
UI.renderSidebarSales = function (state, kpis, filterId) {
    const currentUser = state.currentUser || { fullName: 'Vendedor', username: 'Me' };
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;

    return `
        <!-- OVERLAY MOBILE -->
        <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden md:hidden glass-effect" onclick="document.getElementById('salesSidebar').classList.add('-translate-x-full'); document.getElementById('sidebarOverlay').classList.add('hidden');"></div>

        <aside id="salesSidebar" class="fixed inset-y-0 left-0 w-[260px] bg-[#080c14] text-gray-400 flex flex-col h-full z-50 border-r border-white/[0.04] transition-transform duration-300 transform -translate-x-full md:translate-x-0 md:relative md:flex shadow-2xl md:shadow-none">
            <div class="h-14 flex items-center justify-between px-5 border-b border-white/[0.04] flex-shrink-0">
               <div class="flex items-center gap-3">
                   <img src="favicon.png" alt="Logo" class="w-7 h-7 rounded-lg object-contain flex-shrink-0">
                   <span class="font-bold text-[13px] text-white tracking-wide">KPI Master</span>
               </div>
               <!-- MOBILE CLOSE BUTTON -->
               <button class="md:hidden text-gray-600 hover:text-white transition-colors" onclick="document.getElementById('salesSidebar').classList.add('-translate-x-full'); document.getElementById('sidebarOverlay').classList.add('hidden');">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>

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
                        <div class="relative flex items-center">
                            <div class="absolute left-3 pointer-events-none text-gray-500 z-10">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <input type="text" id="startDate" placeholder="${t('Data inicial', 'Start date')}" value="${state.startDate || ''}" class="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-[12px] text-gray-200 focus:outline-none focus:border-blue-500/50 cursor-pointer font-semibold transition-all hover:bg-[#111723] hover:border-white/[0.15]">
                        </div>
                        <div class="relative flex items-center">
                            <div class="absolute left-3 pointer-events-none text-gray-500 z-10">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <input type="text" id="endDate" placeholder="${t('Data final', 'End date')}" value="${state.endDate || ''}" class="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-[12px] text-gray-200 focus:outline-none focus:border-blue-500/50 cursor-pointer font-semibold transition-all hover:bg-[#111723] hover:border-white/[0.15]">
                        </div>

                        <!-- PRESETS -->
                        <div class="grid grid-cols-3 gap-1.5 pt-1">
                            <button data-preset="7d" class="date-preset-btn text-[10px] font-bold text-gray-400 bg-[#0d1117] hover:bg-blue-600/20 hover:text-blue-300 border border-white/[0.06] hover:border-blue-500/30 rounded-lg py-1.5 transition-all">${t('7 Dias', '7 Days')}</button>
                            <button data-preset="30d" class="date-preset-btn text-[10px] font-bold text-gray-400 bg-[#0d1117] hover:bg-blue-600/20 hover:text-blue-300 border border-white/[0.06] hover:border-blue-500/30 rounded-lg py-1.5 transition-all">${t('30 Dias', '30 Days')}</button>
                            <button data-preset="month" class="date-preset-btn text-[10px] font-bold text-gray-400 bg-[#0d1117] hover:bg-blue-600/20 hover:text-blue-300 border border-white/[0.06] hover:border-blue-500/30 rounded-lg py-1.5 transition-all">${t('Mês', 'Month')}</button>
                        </div>

                        ${(state.startDate || state.endDate) ? `<button id="clearDates" class="w-full text-[11px] text-rose-400/90 hover:text-rose-300 py-1 font-bold transition-colors">${t('Limpar datas', 'Clear dates')}</button>` : ''}
                    </div>
                </div>

                <!-- SALES NÃO TEM FILTRO DE EQUIPA -->

            </div>
            
            <!-- Bottom nav actions -->
            <div class="p-4 border-t border-white/[0.04] flex flex-col gap-1 flex-shrink-0">
                <button id="sendFeedbackSidebarBtnSales" onclick="document.getElementById('bugReportPopup').classList.remove('hidden')" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/[0.05] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 text-gray-600 group-hover:text-blue-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                    <span>${t('Enviar Feedback', 'Send Feedback')}</span>
                </button>
                <button onclick="document.getElementById('docsComingSoonPopup').classList.remove('hidden')" class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-500/[0.05] transition-all duration-200 font-semibold text-[12px]">
                    <svg class="w-4 h-4 text-gray-600 group-hover:text-green-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>${t('Documentos de Ajuda', 'Help Documents')}</span>
                    <span class="ml-auto text-[8px] font-bold text-green-500/70 bg-green-500/[0.08] border border-green-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">${t('Em breve', 'Coming soon')}</span>
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

        <!-- FEEDBACK POPUP -->
        <div id="bugReportPopup" class="hidden fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onclick="if(event.target===this)this.classList.add('hidden')">
            <div class="bg-[#0b0f19] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button onclick="document.getElementById('bugReportPopup').classList.add('hidden')" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="w-12 h-12 bg-blue-500/[0.1] border border-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <h3 class="text-base font-bold text-white mb-1">${t('Enviar Feedback', 'Send Feedback')}</h3>
                <p class="text-xs text-gray-400 mb-3">${t('Queremos a tua opinião e sugestões para continuar a melhorar a app.', 'We want your feedback and suggestions to keep improving the app.')}</p>
                
                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 text-[11px] text-blue-300/90 leading-relaxed flex items-start gap-2">
                    <span class="text-sm flex-shrink-0">🔒</span>
                    <span>${t('O feedback é enviado de forma 100% anónima. Se tiveres algum problema que precise de resposta ou resolução, inclui o teu email na caixa de texto para te podermos contactar!', 'Feedback is submitted 100% anonymously. If you have an issue that requires support or a response, please include your email in the text box so we can reach out!')}</span>
                </div>

                <textarea id="feedbackTextInputSales" rows="4" placeholder="${t('Escreve a tua sugestão ou opinião aqui (inclui o teu email se precisares de resposta)...', 'Write your suggestion or feedback here (include your email if you need a response)...')}" class="w-full bg-[#111726] border border-white/[0.08] rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none mb-4"></textarea>

                <div class="flex items-center gap-2 justify-end">
                    <button onclick="document.getElementById('bugReportPopup').classList.add('hidden')" class="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors">${t('Cancelar', 'Cancel')}</button>
                    <button onclick="App.sendFeedback('feedbackTextInputSales')" class="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-colors">${t('Enviar Feedback', 'Submit Feedback')}</button>
                </div>
            </div>
        </div>

        <!-- DOCS COMING SOON POPUP -->
        <div id="docsComingSoonPopup" class="hidden fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onclick="if(event.target===this)this.classList.add('hidden')">
            <div class="bg-[#0b0f19] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative">
                <button onclick="document.getElementById('docsComingSoonPopup').classList.add('hidden')" class="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="w-14 h-14 bg-[#0d1527] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h3 class="text-[17px] font-black text-white mb-2">${t('Scripts e Documentos', 'Scripts & Documents')}</h3>
                <p class="text-[13px] text-gray-500 leading-relaxed mb-6">${t('Esta funcionalidade está em desenvolvimento. Em breve terás acesso a scripts de reativação, templates de email e guiões de vendas diretamente aqui.', 'This feature is in development. Soon you\'ll have access to reactivation scripts, email templates and sales playbooks directly here.')}</p>
                <div class="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse"></span>
                    ${t('Nova funcionalidade a caminho', 'New feature coming soon')}
                </div>
            </div>
        </div>

        <!-- SETTINGS MODAL -->
        <div id="settingsModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
