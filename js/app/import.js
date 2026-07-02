App.importarCSV = function () {
    this.openLeadImportModal();
};

App.IMPORT_ASSIGNED_MEMBER_ID = '69fb56e4daec20647f9a6a7b';

App.openLeadImportModal = function () {
    const listas = this.state.rawData?.listas || [];
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;
    const existing = document.getElementById('leadImportModal');

    if (existing) existing.remove();

    if (!listas.length) {
        alert(t('Nao foram encontradas listas neste quadro.', 'No lists were found on this board.'));
        return;
    }

    const options = listas.map(list => `
        <option value="${Utils.escapeHtmlAttribute(list.id)}">${Utils.escapeHtml(list.name)}</option>
    `).join('');

    const modal = document.createElement('div');
    modal.id = 'leadImportModal';
    modal.className = 'fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="w-full max-w-xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                    <h2 class="text-lg font-black text-white">${t('Importar leads por CSV', 'Import leads by CSV')}</h2>
                    <p class="text-xs text-gray-400 mt-1">${t('Colunas aceites: nome, descricao, comentario e lista.', 'Accepted columns: name, description, comment and list.')}</p>
                </div>
                <button id="closeLeadImportModal" class="w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            <form id="leadImportForm" class="p-6 space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">${t('Lista padrao', 'Default list')}</label>
                    <select id="leadDefaultListId" class="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500">
                        ${options}
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">CSV</label>
                    <input id="leadCsvFile" type="file" accept=".csv,text/csv" required class="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-emerald-500">
                    <p class="mt-3 text-xs text-gray-500 leading-relaxed">${t('Exemplo: nome,descricao,comentario,lista. Podes ter varias colunas de comentarios ou separar comentarios com |.', 'Example: name,description,comment,list. You can use multiple comment columns or separate comments with |.')}</p>
                </div>

                <div id="leadImportError" class="hidden bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 text-sm"></div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" id="cancelLeadImport" class="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors">${t('Cancelar', 'Cancel')}</button>
                    <button type="submit" id="saveLeadImport" class="px-5 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors">${t('Importar CSV', 'Import CSV')}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('closeLeadImportModal').addEventListener('click', close);
    document.getElementById('cancelLeadImport').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    document.getElementById('leadCsvFile').focus();
    document.getElementById('leadImportForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.importLeadsFromSelectedCsv();
    });
};

App.importLeadsFromSelectedCsv = async function () {
    const file = document.getElementById('leadCsvFile')?.files?.[0];
    const defaultListId = document.getElementById('leadDefaultListId')?.value;
    const errorBox = document.getElementById('leadImportError');
    const submitBtn = document.getElementById('saveLeadImport');
    const lang = UI._lpLang || 'pt';
    const t = (pt, en) => lang === 'en' ? en : pt;

    if (!file) {
        errorBox.textContent = t('Escolhe um ficheiro CSV.', 'Choose a CSV file.');
        errorBox.classList.remove('hidden');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t('A importar...', 'Importing...');
    errorBox.classList.add('hidden');

    try {
        const text = await file.text();
        const rows = App.parseLeadCsv(text);

        if (rows.length < 2) {
            throw new Error(t('O CSV precisa de cabecalho e pelo menos uma linha.', 'The CSV needs a header and at least one row.'));
        }

        const result = await this.importLeadRows(rows, defaultListId);

        document.getElementById('leadImportModal')?.remove();
        const details = result.firstError ? `\n${t('Primeiro erro:', 'First error:')} ${result.firstError}` : '';
        alert(`${t('Importacao concluida!', 'Import completed!')}\n${t('Sucesso:', 'Success:')} ${result.imported}\n${t('Erros:', 'Errors:')} ${result.errors}${details}`);
        await this.conectarTrello();
    } catch (err) {
        errorBox.textContent = err.status === 401
            ? t('Tens de autorizar novamente o Trello com permissao de escrita.', 'Authorize Trello again with write permission.')
            : (err.message || t('Erro ao importar CSV.', 'Error importing CSV.'));
        errorBox.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t('Importar CSV', 'Import CSV');
    }
};

App.importLeadRows = async function (rows, defaultListId, due = null) {
    const header = rows[0].map(item => item.trim().toLowerCase());
    const nameIdx = header.findIndex(item => ['nome', 'name', 'titulo', 'title', 'card', 'lead'].some(key => item.includes(key)));
    const descIdx = header.findIndex(item => ['descricao', 'descrição', 'description', 'desc', 'detalhes', 'details'].some(key => item.includes(key)));
    const listIdx = header.findIndex(item => ['lista', 'list', 'fase', 'stage'].some(key => item.includes(key)));
    const emailIdx = header.findIndex(item => ['email', 'e-mail', 'mail'].some(key => item.includes(key)));
    const phoneIdx = header.findIndex(item => ['nnr', 'telefone', 'telemovel', 'telemóvel', 'phone', 'mobile', 'contacto', 'contato'].some(key => item.includes(key)));
    const commentIndices = header.reduce((acc, item, index) => {
        if (['comentario', 'comentário', 'comment', 'comments', 'observacao', 'observação', 'obs'].some(key => item.includes(key))) acc.push(index);
        return acc;
    }, []);
    const listas = this.state.rawData?.listas || [];
    let imported = 0;
    let errors = 0;
    let firstError = '';

    if (nameIdx === -1) {
        throw new Error('Coluna obrigatoria nao encontrada: nome.');
    }

    for (let index = 1; index < rows.length; index++) {
        const row = rows[index];
        const name = App.buildImportCardName(row, nameIdx, emailIdx, phoneIdx);

        if (!name) continue;

        const desc = descIdx > -1 ? (row[descIdx] || '').trim() : '';
        const fullDesc = App.buildImportDescription(header, row, descIdx, nameIdx, listIdx, emailIdx, phoneIdx, commentIndices, desc);
        const listName = listIdx > -1 ? (row[listIdx] || '').trim() : '';
        const targetList = App.findImportList(listas, listName) || listas.find(list => list.id === defaultListId) || listas[0];
        const comments = commentIndices.flatMap(commentIndex => (row[commentIndex] || '').split('|')).map(item => item.trim()).filter(Boolean);

        try {
            const card = await TrelloAPI.createCard(
                this.state.apiKey,
                this.state.token,
                targetList.id,
                name,
                fullDesc,
                due,
                [App.IMPORT_ASSIGNED_MEMBER_ID]
            );

            for (const comment of comments) {
                await TrelloAPI.addComment(this.state.apiKey, this.state.token, card.id, comment);
            }

            imported++;
        } catch (err) {
            console.error('Erro ao importar linha ' + (index + 1), err);
            errors++;
            if (!firstError) firstError = `linha ${index + 1}: ${err.message || 'erro desconhecido'}`;

            if (err.status === 401 || err.status === 403) {
                throw new Error('O token atual nao tem permissao para criar cards. Clica em Sair e autoriza novamente o Trello com permissao read,write.');
            }
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { imported, errors, firstError };
};

App.buildImportCardName = function (row, nameIdx, emailIdx, phoneIdx) {
    const parts = [
        row[nameIdx],
        phoneIdx > -1 ? row[phoneIdx] : '',
        emailIdx > -1 ? row[emailIdx] : ''
    ].map(item => (item || '').trim()).filter(Boolean);

    return parts.join(' | ');
};

App.buildImportDescription = function (header, row, descIdx, nameIdx, listIdx, emailIdx, phoneIdx, commentIndices, desc) {
    const ignored = new Set([nameIdx, descIdx, listIdx, emailIdx, phoneIdx, ...commentIndices].filter(index => index > -1));
    const extras = header
        .map((label, index) => ({ label, value: (row[index] || '').trim(), index }))
        .filter(item => item.value && !ignored.has(item.index))
        .map(item => `${item.label}: ${item.value}`);

    if (!extras.length) return desc;
    return [desc, extras.join('\n')].filter(Boolean).join('\n\n');
};

App.findImportList = function (listas, listName) {
    if (!listName) return null;

    const normalized = listName.toLowerCase().trim();
    return listas.find(list => list.name.toLowerCase().trim() === normalized)
        || listas.find(list => list.name.toLowerCase().includes(normalized));
};

App.parseLeadCsv = function (text) {
    const delimiter = App.detectCsvDelimiter(text);
    const rows = [];
    let row = [];
    let cell = '';
    let insideQuotes = false;

    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        const next = text[index + 1];

        if (char === '"' && insideQuotes && next === '"') {
            cell += '"';
            index++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === delimiter && !insideQuotes) {
            row.push(cell);
            cell = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && next === '\n') index++;
            row.push(cell);
            if (row.some(value => value.trim())) rows.push(row);
            row = [];
            cell = '';
        } else {
            cell += char;
        }
    }

    row.push(cell);
    if (row.some(value => value.trim())) rows.push(row);

    return rows;
};

App.detectCsvDelimiter = function (text) {
    const firstLine = text.split(/\r?\n/).find(line => line.trim()) || '';
    const delimiters = [',', ';', '\t'];

    return delimiters
        .map(delimiter => ({ delimiter, count: firstLine.split(delimiter).length }))
        .sort((a, b) => b.count - a.count)[0].delimiter;
};

App.processarImportacao = async function (file) {
    if (!file) return;

    const text = await file.text();
    const rows = App.parseLeadCsv(text);
    const result = await this.importLeadRows(rows, this.state.rawData?.listas?.[0]?.id);

    alert(`Importacao concluida!\nSucesso: ${result.imported}\nErros: ${result.errors}`);
    await this.conectarTrello();
};
