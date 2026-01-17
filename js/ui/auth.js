UI.renderConfig = function (state) {
    // Se estivermos a carregar, mostrar spinner
    if (state.loading) {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center bg-[#05070a] relative overflow-hidden">
                <!-- Decorative Glow -->
                <div class="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>

                <div class="relative z-10 text-center flex flex-col items-center">
                    <!-- Glowing Icon -->
                    <div class="mb-8 relative">
                        <div class="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full"></div>
                        <img src="favicon.png" alt="Logo" class="w-20 h-20 relative z-10 rounded-2xl shadow-2xl">
                    </div>

                    <!-- Title -->
                    <h2 class="text-3xl font-black text-white tracking-widest mb-2 uppercase drop-shadow-md">KPI Master</h2>
                    
                    <!-- Subtitle -->
                    <p class="text-sm text-gray-400 font-medium tracking-wide mb-8 animate-pulse">A carregar os seus quadros...</p>

                    <!-- Progress Bar -->
                    <div class="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
                         <!-- Indeterminate Loading Animation -->
                        <div class="absolute top-0 left-0 h-full w-1/3 bg-blue-500 rounded-full animate-[slide_1.5s_ease-in-out_infinite]" style="animation: loadingBar 2s infinite ease-in-out;"></div>
                    </div>
                </div>

                <!-- Custom Animation Style for this specific view -->
                 <style>
                    @keyframes loadingBar {
                        0% { left: -30%; width: 30%; }
                        50% { left: 35%; width: 30%; }
                        100% { left: 100%; width: 30%; }
                    }
                </style>
            </div>
        `;
    }

    // Se já tivermos token mas falta escolher o quadro
    if (state.token && !state.boardId) {
        return UI.renderBoardSelector(state);
    }

    // Line 47
    return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div class="bg-white rounded-[2rem] shadow-2xl p-12 max-w-md w-full border border-gray-100 text-center relative overflow-hidden">
                    <!-- Decorative Background Element -->
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <div class="mb-12 relative z-10">
                    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <span class="text-4xl text-white font-black">T</span>
                    </div>
                    <h1 class="text-4xl font-black text-gray-900 mb-3 tracking-tight">Trello KPI</h1>
                    <p class="text-gray-500 font-medium text-lg">Dashboard de Performance</p>
                </div>

                ${state.error ? `
                    <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 text-sm font-medium text-left shadow-sm">
                        <div class="flex items-center gap-2 mb-1 font-bold">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            Erro de Conexão
                        </div>
                        ${state.error}
                    </div>
                ` : ''}

                <div class="space-y-8 relative z-10">
                    <button id="loginTrelloBtn"
                        class="group w-full bg-[#0052CC] text-white py-5 px-6 rounded-2xl font-bold text-lg hover:bg-[#0747A6] transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-4 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.75 17h-3.5a.75.75 0 01-.75-.75V7.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v8.5a.75.75 0 01-.75.75zm5.25-4.5h-3.5a.75.75 0 01-.75-.75V7.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75z" /></svg>
                        <span>Entrar com Trello</span>
                    </button>

                    <p class="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed px-4">
                        Serás redirecionado de forma segura para o Trello para autorizar o acesso aos teus quadros.
                    </p>
                </div>

                <div class="mt-12 pt-6 border-t border-gray-100">
                    <button id="showManualConfig" class="text-xs font-semibold text-gray-400 hover:text-gray-600 transition flex items-center justify-center gap-1 mx-auto group">
                        <span>Configuração Manual</span>
                        <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
        `;
};

UI.renderBoardSelector = function (state) {
    const boards = state.availableBoards || [];

    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div class="bg-white rounded-3xl shadow-xl p-10 max-w-4xl w-full border border-gray-100 flex flex-col max-h-[90vh]">
                <div class="mb-8 flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Os teus Quadros</h2>
                        <p class="text-gray-500">Seleciona o quadro que queres analisar.</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="App.setRole(null)" class="text-sm text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition border border-transparent">
                            Trocar Função
                        </button>
                        <button id="logoutBtn" class="text-sm text-red-500 hover:text-red-700 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-100">
                            Sair
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                    ${boards.length > 0 ? boards.map(board => `
                        <div class="board-card group cursor-pointer bg-white border-2 border-gray-100 p-6 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between h-40"
                             data-id="${board.id}">
                            <div>
                                <h3 class="font-bold text-lg text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-2 transition-colors">${board.name}</h3>
                                <div class="w-8 h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>
                            <p class="text-xs font-medium text-gray-400 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>    
                                ${new Date(board.dateLastActivity || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    `).join('') : `
                        <div class="col-span-full py-12 text-center text-gray-400">
                            <p class="text-lg">Não encontrámos quadros abertos.</p>
                            <p class="text-sm mt-2">Verifica se tens permissões ou se os quadros estão arquivados.</p>
                        </div>
                    `}
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                    Mostrando ${boards.length} quadros disponíveis
                </div>
            </div>
        </div>
        `;
};

UI.renderManualConfig = function (state) {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
            <div class="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white-900">Configuração Manual</h2>
                    <button id="backToLogin" class="text-sm text-gray-500 hover:text-gray-900 font-medium">Voltar</button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">API Key</label>
                        <input type="text" id="apiKey" value="${state.apiKey}" readonly class="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed">
                            <p class="text-[10px] text-gray-400 mt-1">Chave da aplicação (hardcoded)</p>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Token</label>
                        <input type="text" id="token" value="${state.token}" placeholder="Cola o teu token aqui" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                            <a href="https://trello.com/1/authorize?expiration=never&scope=read&response_type=token&key=${state.apiKey}" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 inline-block">Gerar Token Manualmente</a>
                    </div>
                    <div>
                        <input type="text" id="boardId" value="${state.boardId}" placeholder="ID do Quadro" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Webhook URL (Opcional - Para Exportar Email)</label>
                        <input type="text" id="webhookUrl" value="${state.webhookUrl || ''}" placeholder="https://hook.make.com/..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-xs">
                    </div>
                    <button id="conectarManualBtn" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 shadow-lg transition-transform transform hover:-translate-y-0.5">
                        Conectar Manualmente
                    </button>
                </div>
            </div>
        </div>
        `;
};

UI.renderRoleSelectorScreen = function () {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div class="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full border border-gray-100 flex flex-col items-center text-center">
                <div class="mb-10">
                    <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm transform -rotate-3">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h2 class="text-3xl font-black text-gray-900 mb-4">Bem-vindo!</h2>
                    <p class="text-gray-500 text-lg max-w-md mx-auto">Para personalizar a tua experiência, diz-nos qual é a tua função na equipa.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
                    <!-- Card Gestor -->
                    <button onclick="App.setRole('manager')" class="group relative flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center">
                        <div class="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">Sou Gestor</h3>
                        <p class="text-sm text-gray-400 group-hover:text-gray-500">Quero ver a performance geral da equipa e gerir os funis.</p>

                        <div class="mt-6 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            Acesso Completo
                        </div>
                    </button>

                    <!-- Card Vendedor -->
                    <button onclick="App.setRole('sales')" class="group relative flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-green-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center">
                        <div class="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-100 transition-colors">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 group-hover:text-green-600 mb-2">Sou Vendedor</h3>
                        <p class="text-sm text-gray-400 group-hover:text-gray-500">Quero focar-me nos meus números e nas minhas tarefas.</p>

                        <div class="mt-6 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                            Foco Individual
                        </div>
                    </button>
                </div>

                <button onclick="App.logout()" class="text-sm text-gray-400 hover:text-red-500 hover:underline transition-colors mt-4">
                    Não sou eu (Sair)
                </button>
            </div>
        </div>
        `;
};

UI.renderRoleSelectionModal = function (boardId, boardName) {
    return `
        <div id="roleSelectionModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all scale-100 border border-white/20">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900">Quem és tu?</h3>
                    <p class="text-gray-500 mt-2">Escolhe como queres visualizar o quadro <span class="font-semibold text-gray-700">"${boardName}"</span></p>
                </div>

                <div class="grid gap-4">
                    <button onclick="App.confirmRole('${boardId}', 'manager')" class="group relative flex items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left w-full">
                        <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <div class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Sou Gestor</div>
                            <div class="text-xs text-gray-500">Acesso total a todas as métricas e equipa.</div>
                        </div>
                        <div class="absolute right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>

                    <button onclick="App.confirmRole('${boardId}', 'sales')" class="group relative flex items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all text-left w-full">
                        <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mr-4 group-hover:bg-green-100 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div>
                            <div class="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Sou Vendedor</div>
                            <div class="text-xs text-gray-500">Foco na minha performance e tarefas.</div>
                        </div>
                        <div class="absolute right-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                </div>

                <div class="mt-8 text-center">
                    <button onclick="document.getElementById('roleSelectionModal').remove()" class="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">Cancelar</button>
                </div>
            </div>
        </div >
        `;
};
