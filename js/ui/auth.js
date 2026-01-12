UI.renderConfig = function (state) {
    return `
        <div class="min-h-screen flex items-center justify-center">
            <div class="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full border border-gray-100">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">Trello KPI</h1>
                    <p class="text-gray-500 font-light">Dashboard de Performance</p>
                </div>

                ${state.error ? `
                    <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                        ${state.error}
                    </div>
                ` : ''}

                <div class="space-y-5 mb-8">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">API Key</label>
                        <input type="text" id="apiKey" value="${state.apiKey}" 
                            placeholder="Cole sua API Key"
                            class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Token</label>
                        <input type="text" id="token" value="${state.token}"
                            placeholder="Cole seu Token"
                            class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Board ID</label>
                        <input type="text" id="boardId" value="${state.boardId}"
                            placeholder="ID do board"
                            class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Webhook (Make.com)</label>
                        <input type="text" id="webhookUrl" value="${state.webhookUrl || ''}"
                            placeholder="https://hook.us1.make.com/..."
                            class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Groq API Key (Opcional - Para IA)</label>
                        <input type="text" id="groqApiKey" value="${state.groqApiKey || ''}"
                            placeholder="gsk_..."
                            class="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50">
                        <p class="text-[10px] text-gray-400 mt-1">Necessário para gerar sugestões automáticas.</p>
                    </div>
                </div>

                <button id="conectarBtn" ${state.loading ? 'disabled' : ''}
                    class="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 shadow-lg">
                    ${state.loading ? 'Conectando...' : 'Conectar'}
                </button>

                <div class="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 class="font-semibold text-gray-900 mb-3 text-sm">Como obter credenciais</h3>
                    <ol class="space-y-2 text-xs text-gray-600">
                        <li><strong>API Key:</strong> trello.com/power-ups/admin</li>
                        <li><strong>Token:</strong> Clique em "Generate a Token"</li>
                        <li><strong>Board ID:</strong> Copie da URL do board</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
};
