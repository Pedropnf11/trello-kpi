Charts.renderComentariosVsLeads = function (canvasId, dados) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
    }

    const consultores = [...dados.consultores]
        .filter(c => c.leads > 0 || c.comentarios > 0)
        .slice(0, 15);

    this.charts[canvasId] = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Consultores',
                data: consultores.map(c => ({
                    x: c.leads,
                    y: c.comentarios,
                    nome: c.nome
                })),
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            ...this.defaultConfig,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Leads',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Comentários',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                ...this.defaultConfig.plugins,
                tooltip: {
                    ...this.defaultConfig.plugins.tooltip,
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            return `${data.nome}: ${data.x} leads, ${data.y} comentários`;
                        }
                    }
                }
            }
        }
    });
};
