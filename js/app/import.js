App.importarCSV = function () {
    document.getElementById('csvInput').click();
};

App.processarImportacao = async function (file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target.result;
        const rows = Utils.parseCSV(text);

        if (rows.length < 2) {
            alert('O arquivo CSV deve conter cabeçalho e dados.');
            return;
        }

        const header = rows[0].map(h => h.toLowerCase());
        const nomeIdx = header.findIndex(h => h.includes('nome') || h.includes('titulo') || h.includes('card'));
        const descIdx = header.findIndex(h => h.includes('desc') || h.includes('detalhes'));
        const listaIdx = header.findIndex(h => h.includes('lista') || h.includes('fase'));

        // Identificar TODAS as colunas que podem ser comentários
        const comentIndices = header.reduce((acc, h, i) => {
            if (h.includes('coment') || h.includes('obs')) acc.push(i);
            return acc;
        }, []);

        if (nomeIdx === -1) {
            alert('Coluna "Nome" ou "Título" não encontrada.');
            return;
        }

        const { apiKey, token, boardId, rawData } = this.state;
        const listas = rawData.listas;

        if (!listas || listas.length === 0) {
            alert('Nenhuma lista encontrada no board.');
            return;
        }

        let importados = 0;
        let erros = 0;

        const btn = document.getElementById('importarBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Importando...';
        btn.disabled = true;

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < nomeIdx + 1) continue;

            const nome = row[nomeIdx];
            const desc = descIdx > -1 ? row[descIdx] : '';
            const listaNome = listaIdx > -1 ? row[listaIdx] : '';

            // Encontrar ID da lista
            let targetList = listas[0];
            if (listaNome) {
                const normalizedSearch = listaNome.toLowerCase().trim();

                // 1. Prioridade: Match Exato
                let found = listas.find(l => l.name.toLowerCase().trim() === normalizedSearch);

                // 2. Tentativa: Parcial
                if (!found) {
                    found = listas.find(l => l.name.toLowerCase().includes(normalizedSearch));
                }

                if (found) {
                    targetList = found;
                } else {
                    console.warn(`Lista '${listaNome}' não encontrada no Trello. Usando a padrão: ${targetList.name}`);
                }
            }

            try {
                // Criar Card
                const card = await TrelloAPI.createCard(apiKey, token, targetList.id, nome, desc);

                // Adicionar Comentários (suporta múltiplas colunas E separador |)
                if (card.id && comentIndices.length > 0) {
                    const todosComentarios = [];

                    comentIndices.forEach(idx => {
                        if (row[idx]) {
                            // Permite separar por | mesmo dentro de uma coluna
                            const parts = row[idx].split('|');
                            parts.forEach(p => {
                                if (p.trim()) todosComentarios.push(p.trim());
                            });
                        }
                    });

                    for (const coment of todosComentarios) {
                        await TrelloAPI.addComment(apiKey, token, card.id, coment);
                    }
                }
                importados++;
            } catch (error) {
                console.error('Erro ao importar linha ' + i, error);
                erros++;
            }

            await new Promise(r => setTimeout(r, 100));
        }

        btn.textContent = originalText;
        btn.disabled = false;

        alert(`Importação concluída!\nSucesso: ${importados}\nErros: ${erros}`);
        this.conectarTrello();
    };
    reader.readAsText(file);
};
