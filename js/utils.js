const Utils = {
    /**
     * @param {string} text 
     * @returns {string}
     * @example
    
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';

        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    /**
    
     * @param {string} text 
     * @returns {string} 
     * @example
    
 
     */
    escapeHtmlAttribute(text) {
        if (text === null || text === undefined) return '';

        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&#x27;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    /**
     * @param {string|Date} date 
     * @returns {string} 
     */
    formatDateSafe(date) {
        if (!date) return '';

        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString('pt-PT');
        } catch {
            return '';
        }
    },

    getCardDate(cardId) {
        if (!cardId) return new Date();
        return new Date(1000 * parseInt(cardId.substring(0, 8), 16));
    },

    getStartOfWeek() {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    },


    generateCSV(headersOrData, rows, filename) {
        let csvContent = "";

        if (Array.isArray(headersOrData) && Array.isArray(rows)) {

            const headers = headersOrData.join(',');
            const body = rows.map(row => row.map(val => {

                const stringVal = String(val).replace(/"/g, '""');
                return `"${stringVal}"`;
            }).join(',')).join('\n');
            csvContent = headers + '\n' + body;
        } else {

            const data = headersOrData;
            if (!data || !data.length) return;
            const headers = Object.keys(data[0]).join(',');
            const body = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(',')).join('\n');
            csvContent = headers + '\n' + body;
            filename = rows;
        }


        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename || 'export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    formatarTempo(horasDecimais) {
        if (!horasDecimais && horasDecimais !== 0) return '0h 0m';
        const horas = Math.floor(horasDecimais);
        const minutos = Math.round((horasDecimais - horas) * 60);
        return `${horas}h ${minutos}m`;
    },

    parseCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n').filter(r => r.trim());
                if (rows.length < 2) return resolve([]);

                const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const data = rows.slice(1).map(row => {
                    const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
                    const obj = {};
                    headers.forEach((h, i) => obj[h] = values[i]);
                    return obj;
                });
                resolve(data);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
};

window.Utils = Utils;
