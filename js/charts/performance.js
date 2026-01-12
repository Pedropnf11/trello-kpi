Charts.renderConsultorPerformance = function (canvasId, dados) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
    }

    // Top 10 consultores por leads
    const consultores = [...dados.consultores]
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 10);

    this.charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: consultores.map(c => c.nome),
            datasets: [
                {
                    label: 'Leads',
                    data: consultores.map(c => c.leads),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                },
                {
                    label: 'Comentários',
                    data: consultores.map(c => c.comentarios),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            ...this.defaultConfig,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
};
