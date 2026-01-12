// Utility functions
const Utils = {
    // Helper para data do card a partir do ID
    getCardDate: (id) => {
        return new Date(1000 * parseInt(id.substring(0, 8), 16));
    },

    // Início da semana atual (Segunda-feira)
    getStartOfWeek: () => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day == 0 ? -6 : 1);
        const inicioSemana = new Date(now.setDate(diff));
        inicioSemana.setHours(0, 0, 0, 0);
        return inicioSemana;
    },

    generateCSV: (headers, rows, filename) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    formatarTempo: (horas) => {
        if (horas === 0) return '0h';

        const dias = Math.floor(horas / 24);
        const horasRestantes = Math.floor(horas % 24);
        const minutos = Math.floor((horas % 1) * 60);

        const partes = [];
        if (dias > 0) partes.push(`${dias}d`);
        if (horasRestantes > 0) partes.push(`${horasRestantes}h`);
        if (minutos > 0 && dias === 0) partes.push(`${minutos}m`);

        return partes.join(' ') || '0h';
    },

    parseCSV: (text) => {
        const rows = [];
        let currentRow = [];
        let currentField = '';
        let insideQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentField += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                currentRow.push(currentField);
                currentField = '';
            } else if ((char === '\r' || char === '\n') && !insideQuotes) {
                if (currentRow.length > 0 || currentField) {
                    currentRow.push(currentField);
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                currentField += char;
            }
        }
        if (currentRow.length > 0 || currentField) {
            currentRow.push(currentField);
            rows.push(currentRow);
        }
        return rows;
    }
};
