// ========================================
// DASHBOARD ROUTER
// ========================================
UI.renderDashboard = function (state) {
    const userRole = state.userRole;

    // Decide qual dashboard mostrar baseado no role
    if (userRole === 'sales') {
        return UI.renderSalesDashboard(state);
    } else {
        // Default: Manager dashboard (quando userRole === 'manager' ou null)
        return UI.renderManagerDashboard(state);
    }
};

UI.renderHeader = function () { return ''; };