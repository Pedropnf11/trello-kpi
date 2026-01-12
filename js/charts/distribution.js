Charts.renderListaDistribuicao = function (canvasId, dados, listsDef) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
    }

    const listCounts = listsDef.map(l => dados.listCounts[l.id] || 0);

    this.charts[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: listsDef.map(l => l.name),
            datasets: [{
                data: listCounts,
                backgroundColor: this.colors.primary,
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...this.defaultConfig,
            cutout: '65%',
            plugins: {
                ...this.defaultConfig.plugins,
                legend: {
                    ...this.defaultConfig.plugins.legend,
                    position: 'right'
                }
            }
        }
    });
};
