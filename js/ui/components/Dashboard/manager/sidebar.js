// ========================================
// SIDEBAR MANAGER COMPONENT
// ========================================
UI.renderSidebarManager = function (state, kpis, filterId) {
    const currentUser = state.currentUser || { fullName: 'Gestor', username: 'Me' };

    return `
        <!-- OVERLAY MOBILE (Manager) -->
        <div id="managerSidebarOverlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden md:hidden glass-effect" onclick="document.getElementById('managerSidebar').classList.add('-translate-x-full'); document.getElementById('managerSidebarOverlay').classList.add('hidden');"></div>

        <aside id="managerSidebar" class="fixed inset-y-0 left-0 w-[280px] bg-[#0b0f19] text-gray-400 flex flex-col h-full z-50 border-r border-gray-800 transition-transform duration-300 transform -translate-x-full md:translate-x-0 md:relative md:flex shadow-2xl md:shadow-none">
            <div class="h-16 flex items-center justify-between px-5 border-b border-gray-800">
               <div class="flex items-center">
                   <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg mr-3">K</div>
                   <span class="font-bold text-white tracking-wide">KPI Master</span>
               </div>
               <!-- MOBILE CLOSE BUTTON -->
               <button class="md:hidden text-gray-400 hover:text-white" onclick="document.getElementById('managerSidebar').classList.add('-translate-x-full'); document.getElementById('managerSidebarOverlay').classList.add('hidden');">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>

            <div class="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar-dark">
                
                <!-- 1. PERFIL (COMUM) -->
                <div>
                    <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">O Meu Perfil</label>
                     <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            ${currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : 'ME'}
                        </div>
                        <div class="overflow-hidden">
                            <div class="text-sm font-bold text-white truncate" title="${currentUser.fullName}">${currentUser.fullName}</div>
                            <div class="text-[10px] text-green-500 font-bold uppercase">Conectado</div>
                        </div>
                     </div>
                </div>

                <!-- 2. PERIODO (COMUM) -->
                <div>
                    <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block pl-2">Período</label>
                    <div class="bg-gray-900 rounded-lg p-3 border border-gray-800 space-y-2">
                        <input type="date" id="startDate" value="${state.startDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        <input type="date" id="endDate" value="${state.endDate || ''}" class="w-full bg-gray-800 border-gray-700 rounded px-2 py-1 text-xs text-white">
                        ${(state.startDate || state.endDate) ? `<button id="clearDates" class="w-full text-xs text-red-500 py-1 hover:text-red-400">Limpar</button>` : ''}
                    </div>
                </div>

                <!-- 3. EQUIPA (GESTOR) -->
                <div>
                     <div class="flex items-center justify-between mb-3 pl-2 cursor-pointer" onclick="document.getElementById('teamList').classList.toggle('hidden'); document.getElementById('teamArrow').classList.toggle('rotate-180')">
                        <label class="text-[10px] text-gray-500 font-bold uppercase tracking-widest cursor-pointer">Equipa</label>
                        <svg id="teamArrow" class="w-4 h-4 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </div>
                     
                     <div id="teamList" class="space-y-1 transition-all duration-300">
                        <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${!filterId ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}"
                             onclick="document.getElementById('memberFilter').value=''; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                            <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold">ALL</div>
                            <span class="text-sm font-medium">Todos</span>
                        </button>
                        ${kpis.geral.consultores.map(c => `
                            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${c.id === filterId ? 'bg-gray-800 text-white border border-gray-700' : 'hover:bg-gray-800 hover:text-white'}"
                                 onclick="document.getElementById('memberFilter').value='${c.id}'; document.getElementById('memberFilter').dispatchEvent(new Event('change'));">
                                 <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold uppercase">${c.nome.substring(0, 2)}</div>
                                <span class="text-sm font-medium truncate">${c.nome}</span>
                            </button>
                        `).join('')}
                     </div>
                     <select id="memberFilter" class="hidden"><option value="">Todos</option>${kpis.geral.consultores.map(c => `<option value="${c.id}" ${c.id === filterId ? 'selected' : ''}>${c.nome}</option>`).join('')}</select>
                </div>


            </div>
            
            <div class="p-4 border-t border-gray-800 flex flex-col gap-3">
                <button id="docsBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-green-900/10 active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Documentos de Ajuda</span>
                </button>
                 <button id="tutorialBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-blue-900/10 active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <span>Tutorial</span>
                </button>
                <button id="settingsBtn" class="group w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800 transition-all duration-300 font-bold text-sm shadow-sm active:scale-95" title="Configurações">
                    <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>Configurações</span>
                </button>
                 <button id="configBtn" class="group w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-red-900/10 active:scale-95" title="Terminar Sessão">
                    <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Sair</span>
                </button>
            </div>
        </aside>

        <!-- DOCS MODAL -->
        <div id="docsModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-fadeIn">
                 <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b border-gray-700 bg-[#0f172a]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center text-green-500">
                             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                             <h2 class="text-xl font-bold text-white">Documentos de Ajuda</h2>
                             <p class="text-xs text-gray-400">Recursos e guiões para a equipa.</p>
                        </div>
                    </div>
                    <button id="closeDocsBtn" class="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-700 bg-[#1e293b] px-6 gap-6">
                    <button class="docs-tab-btn py-4 text-sm font-bold text-green-500 border-b-2 border-green-500 hover:text-green-400 transition-colors" data-tab="vendas">
                        Vendas & Scripts
                    </button>
                    <button class="docs-tab-btn py-4 text-sm font-bold text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="processos">
                        Processos Internos
                    </button>
                    <button class="docs-tab-btn py-4 text-sm font-bold text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-600 transition-colors" data-tab="templates">
                        Templates de Mensagem
                    </button>
                </div>

                <!-- Content Area -->
                <div class="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#0f172a]">
                    <!-- Sidebar List (Mock Files) -->
                    <div class="w-full md:w-1/3 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto p-4 space-y-2">
                        <!-- Content for Vendas -->
                        <div id="docs-list-vendas" class="docs-list-content space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">Guiões de Venda</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group" 
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Vendas_Scripts/GUIAO para 1 contacto.pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    GUIAO para 1 contacto.pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">Atualizado há 2 dias • 2.4 MB</div>
                            </button>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group"
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Guião  para leads antigas  (1).pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                     <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Guião para leads antigas
                                </div>
                            </button>
                        </div>

                         <!-- Content for Processos -->
                        <div id="docs-list-processos" class="docs-list-content hidden space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">Onboarding</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Manual de Boas Vindas.pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">Versão 2024</div>
                            </button>
                        </div>
                        
                         <!-- Content for Templates -->
                        <div id="docs-list-templates" class="docs-list-content hidden space-y-2">
                             <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2 mb-2 block">SMS</label>
                            <button class="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] border border-gray-700 hover:border-green-500/50 transition-all group"
                                onclick="document.getElementById('doc-preview-frame').src='/js/docs/Templates_SMS/MODELOS COMPRA CASA (1).pdf'">
                                <div class="font-bold text-gray-200 text-sm group-hover:text-green-400 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    MODELOS COMPRA CASA (1).pdf
                                </div>
                                <div class="text-[10px] text-gray-500 mt-1 pl-6">PDF • Templates SMS</div>
                            </button>
                        </div>
                    </div>

                    <!-- Preview Area (Right Side) -->
                    <div class="flex-1 h-2/3 md:h-full bg-[#2e3b4e] flex flex-col relative">
                        <iframe id="doc-preview-frame" src="/js/docs/Vendas_Scripts/GUIAO para 1 contacto.pdf" class="w-full h-full border-none" title="Pré-visualização"></iframe>
                        
                         <!-- Empty State (Hidden by default now) -->
                        <div id="doc-preview-empty" class="hidden absolute inset-0 flex items-center justify-center bg-[#0b0f19]">
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </div>
                                <h3 class="text-xl font-bold text-gray-300">Selecione um documento</h3>
                                <p class="text-gray-500 max-w-xs mx-auto mt-2">Escolha um ficheiro à esquerda para visualizar.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- TUTORIAL MODAL -->
        <div id="tutorialModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[90vh]">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b border-gray-700 bg-[#0f172a]">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <span class="text-2xl">📚</span> Tutorial & Ajuda
                    </h2>
                    <button id="closeTutorialBtn" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-700 bg-[#1e293b]">
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-blue-500 border-b-2 border-blue-500 hover:bg-gray-800 transition-colors" data-tab="exportar">Exportação</button>
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="filtros">Filtros & Datas</button>
                    <button class="tutorial-tab-btn flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" data-tab="geral">Geral</button>
                </div>

                <!-- Content Area -->
                <div class="p-8 overflow-y-auto bg-[#1e293b] min-h-[300px]">
                    
                    <!-- TAB: EXPORTAR -->
                    <div id="tab-content-exportar" class="tab-content block animate-fadeIn">
                        <h3 class="text-lg font-bold text-white mb-4">Como Exportar?</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">
                            Para exportares os teus dados, deves clicar no botão <strong>"Exportar"</strong> localizado no topo superior direito da aplicação.
                        </p>
                        <ul class="list-disc pl-5 space-y-2 text-gray-400 mb-6">
                            <li><strong class="text-white">PDF:</strong> Gera um relatório visual completo, ideal para apresentações, ideal para apresentações</li>
                            <li><strong class="text-white">CSV:</strong> Baixa os dados brutos para Excel ou Google Sheets.</li>
                            <li><strong class="text-white">Email:</strong> Envia o relatório diretamente para a tua equipa.</li>
                        </ul>
                        <div class="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50">
                            <p class="text-sm text-blue-300">💡 Nota: Para enviar com email é preciso primeiro configurar o webhook no menu de configurações.</p>
                        </div>
                    </div>

                    <!-- TAB: WEBHOOK -->
                    <div id="tab-content-filtros" class="tab-content hidden animate-fadeIn">
                        <h3 class="text-lg font-bold text-white mb-4">Como criar um</h3>
                        <p class="text-gray-300 mb-4">
                            Podes personalizar a visualização utilizando a barra lateral esquerda.
                        </p>
                        <div class="space-y-4">
                            <div class="flex gap-4 items-start">
                                <div class="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-white flex-shrink-0">1</div>
                                <div>
                                    <h4 class="font-bold text-white">Passo 1 de como criar um Webhook</h4>
                                    <p class="text-sm text-gray-400">Primeiro tens de criar conta no Make.com ou zapier.com</p>
                                </div>
                            </div>
                            <div class="flex gap-4 items-start">
                                <div class="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-white flex-shrink-0">2</div>
                                <div>
                                    <h4 class="font-bold text-white">Passo 2</h4>
                                    <p class="text-sm text-gray-400 mb-2">Cria a tua template com uma Webhook, cria conexões com o Gmail</p>
                                    <div class="bg-gray-800 p-3 rounded border border-gray-700">
                                        <p class="text-xs font-bold text-gray-300 mb-2">📥 Templates Prontos (Clique para copiar):</p>
                                        <a href="https://eu1.make.com/public/shared-scenario/sYmeIcy6C7x/integration-webhooks-gmail-corrected" target="_blank" class="block w-full text-left text-xs text-blue-400 hover:text-blue-300 hover:underline truncate mb-1">
                                            🔗 Make.com: Webhook -> Gmail (Simples)
                                        </a>
                                        <a href="https://eu1.make.com/public/shared-scenario/sYmeIcy6C7x/integration-webhooks-gmail-corrected" target="_blank" class="block w-full text-left text-xs text-blue-400 hover:text-blue-300 hover:underline truncate">
                                            🔗 Make.com: Webhook -> Gmail (Avançado)
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
        <div id="settingsModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-fadeIn">
                <div class="flex justify-between items-center p-6 border-b border-gray-700 bg-[#0f172a]">
                    <h2 class="text-xl font-bold text-white">Configurações</h2>
                    <button id="closeSettingsBtn" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Webhook URL (Relatórios)</label>
                        <input type="text" id="dashboardWebhookUrl" value="${state.webhookUrl || ''}" placeholder="https://hook.make.com/..." class="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                        <p class="text-xs text-gray-500 mt-2">Cola aqui o teu Webhook do Make/Zapier para receberes os relatórios por email.</p>
                    </div>
                </div>
                <div class="p-6 border-t border-gray-700 bg-[#0f172a] flex justify-end">
                    <button id="saveSettingsBtn" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        Guardar Alterações
                    </button>
                </div>
            </div>
        </div>
        <!-- LOGOUT MODAL -->
        <div id="logoutModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-700 p-6 flex flex-col gap-4 animate-fadeIn">
                <h3 class="text-xl font-bold text-white text-center">O que pretendes fazer?</h3>
                
                <button id="changeBoardBtn" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-900/20 active:scale-95">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                     Trocar de Quadro / Função
                </button>

                <button id="confirmLogoutBtn" class="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     Terminar Sessão
                </button>

                <button id="cancelLogoutBtn" class="w-full py-2 text-gray-400 hover:text-white font-medium text-sm transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    `;
};
