// Chart.js Visualizations - Premium Design
const Charts = {
    charts: {},

    // Configuração padrão premium
    defaultConfig: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        family: 'Inter',
                        size: 11,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    family: 'Inter',
                    size: 12,
                    weight: '600'
                },
                bodyFont: {
                    family: 'Inter',
                    size: 11
                }
            }
        }
    },

    // Paleta de cores premium
    colors: {
        primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6', '#F97316'],
        gradients: {
            blue: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.2)'],
            purple: ['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.2)'],
            green: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.2)']
        }
    },

    // Gráfico de Performance por Consultor
    renderConsultorPerformance(canvasId, dados) {
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
    },

    // Gráfico de Distribuição por Listas
    renderListaDistribuicao(canvasId, dados, listsDef) {
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
    },

    // Gráfico de Comentários vs Leads
    renderComentariosVsLeads(canvasId, dados) {
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
    },

    // Gráfico de Tempo Médio
    renderTempoMedio(canvasId, temposListas) {
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
    },

    // Renderizar todos os gráficos
    renderAll(kpis, filterId) {
        const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
        const dadosSemanal = KPILogic.filtrarDados(kpis.semanal, filterId);

        // Aguardar o DOM estar pronto
        setTimeout(() => {
            this.renderConsultorPerformance('chartSemanalPerformance', dadosSemanal);
            this.renderConsultorPerformance('chartGeralPerformance', dadosGeral);
            this.renderListaDistribuicao('chartDistribuicao', kpis.geral, kpis.listsDef);
            this.renderComentariosVsLeads('chartComentariosLeads', dadosSemanal);
            this.renderTempoMedio('chartTempoMedio', kpis.temposListas);
        }, 100);
    },

    // Destruir todos os gráficos
    destroyAll() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
};
