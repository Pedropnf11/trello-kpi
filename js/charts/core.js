// Charts Core & Configuration
window.Charts = window.Charts || {};

Charts.charts = {};

Charts.defaultConfig = {
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
};

Charts.colors = {
    primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6', '#F97316'],
    gradients: {
        blue: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.2)'],
        purple: ['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.2)'],
        green: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.2)']
    }
};

Charts.destroyAll = function () {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
};
