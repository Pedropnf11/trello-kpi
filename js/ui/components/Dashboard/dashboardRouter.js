// ========================================
// DASHBOARD ROUTER
// ========================================
import { Analytics } from '../../../analytics.js';

UI.renderDashboard = function (state) {
    const userRole = state.userRole || 'manager';

    if (!UI._lastTrackedRoleView || UI._lastTrackedRoleView !== userRole) {
        UI._lastTrackedRoleView = userRole;
        Analytics.track('web_dashboard_view_rendered', {
            role: userRole,
            description: 'Painel Web carregado para o perfil ' + (userRole === 'sales' ? 'Vendedor' : 'Gestor')
        });
    }

    // Decide qual dashboard mostrar baseado no role
    if (userRole === 'sales') {
        return UI.renderSalesDashboard(state);
    } else {
        // Default: Manager dashboard (quando userRole === 'manager' ou null)
        return UI.renderManagerDashboard(state);
    }
};

UI.renderHeader = function () { return ''; };