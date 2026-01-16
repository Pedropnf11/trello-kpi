import './js/api.js';
import './js/utils.js';
import './js/pdf-export.js';

// Logic (agora dentro de components)
import './js/ui/components/kpis/kpisLogic.js';
import './js/ui/components/Activity/activityLogic.js';
import './js/ui/components/TimeComponents/timeLogic.js';

// UI Core
import './js/ui/core.js';
import './js/ui/auth.js';

// UI Components
import './js/ui/components/Dashboard/manager/sidebar.js';  // Manager Sidebar
import './js/ui/components/Dashboard/sales/sidebarSales.js';  // Sales Sidebar
import './js/ui/components/kpis/tables.js';
import './js/ui/components/TimeComponents/timeComponents.js';
import './js/ui/components/Activity/activityComponent.js';

// Dashboards
import './js/ui/components/Dashboard/manager/dashboardManager.js';
import './js/ui/components/Dashboard/manager/graphsDashboard.js'; // NEW
import './js/ui/components/Dashboard/sales/dashboard.js';
import './js/ui/components/Dashboard/dashboardRouter.js';

// Charts
import './js/charts/core.js';
import './js/charts/performance.js';
import './js/charts/distribution.js';
import './js/charts/scatter.js';
import './js/charts/time.js';
import './js/charts/manager.js';

// App
import './js/app/core.js';
import './js/app/trello.js';
import './js/app/Export_PDF/export.js';
import './js/app/import.js';

// CSS handled via CDN in index.html

// Start the App after all modules are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    // Small timeout to ensure TrelloAPI and other deps are fully ready
    setTimeout(() => App.init(), 0);
}
