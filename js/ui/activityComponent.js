UI.renderActivity = function (atividade) {
    if (!atividade) return '';
    return `
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span></span> Atividade dos utilizadores
                </h2>
                <p class="text-sm text-gray-500 mt-1 font-light">Última semana</p>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
                <!-- Mais Ativo -->
                <div class="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                        Utilizador mais ativo
                    </h3>
                    ${atividade.maisAtivo ? `
                        <div class="space-y-3">
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="text-xl font-bold text-gray-900 mb-3">
                                    ${atividade.maisAtivo.nome}
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="text-3xl font-bold text-green-600">
                                        ${atividade.maisAtivo.acoes}
                                    </span>
                                    <span class="text-sm text-gray-600">ações no Trello</span>
                                </div>
                                
                            </div>
                            <p class="text-xs text-green-900 bg-green-50 p-3 rounded-lg">
                                    Este utilizador realizou mais ações (comentários, movimentações, criação de cards) durante a última semana.
                            </p>
                        </div>
                    ` : '<div class="text-sm text-gray-400">Sem dados disponíveis</div>'}
                </div>

                <!-- Mais Inativo -->
                <div class="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                            Utilizador Mais Inativo
                    </h3>
                    ${atividade.maisInativo ? `
                        <div class="space-y-3">
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="text-xl font-bold text-gray-900 mb-3">
                                    ${atividade.maisInativo.nome}
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="text-3xl font-bold text-yellow-600">
                                        ${atividade.maisInativo.acoes}
                                    </span>
                                    <span class="text-sm text-gray-600">ações no Trello</span>
                                </div>
                                
                            </div>
                            <p class="text-xs text-yellow-900 bg-yellow-50 p-3 rounded-lg">
                                Utilizador menos ativo
                            </p>
                        </div>
                    ` : '<div class="text-sm text-gray-400">Sem dados disponíveis</div>'}
                </div>
            </div>
        </div>
    `;
};
