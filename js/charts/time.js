Charts.renderTempoMedio = function (canvasId, temposListas) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
    }

    const tempoLeads = temposListas.leads.media || 0;
    const tempoNaoAtendeu = temposListas.naoAtendeu.media || 0;

    this.charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [temposListas.leads.nomeList, temposListas.naoAtendeu.nomeList],
            datasets: [{
                label: 'Tempo Médio (horas)',
                data: [tempoLeads, tempoNaoAtendeu],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(249, 115, 22, 1)'
                ],
                borderWidth: 2,
                borderRadius: 12
            }]
        },
        options: {
            ...this.defaultConfig,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: function (value) {
                            return Utils.formatarTempo(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        }
                    }
                }
            },
            plugins: {
                ...this.defaultConfig.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    ...this.defaultConfig.plugins.tooltip,
                    callbacks: {
                        label: function (context) {
                            return 'Tempo: ' + Utils.formatarTempo(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
};
