import './js/api.js';
import './js/utils.js';
import './js/pdf-export.js';

// Logic
import './js/logic/core.js';
import './js/logic/kpis.js';
import './js/logic/activity.js';
import './js/logic/time.js';

// UI
import './js/ui/core.js';
import './js/ui/auth.js';
import './js/ui/dashboard.js';
import './js/ui/tables.js';
import './js/ui/timeComponents.js';
import './js/ui/activityComponent.js';

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
import './js/app/export.js';
import './js/app/import.js';
import './js/app/chat.js';

// CSS handled via CDN in index.html

// Start the App after all modules are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    // Small timeout to ensure TrelloAPI and other deps are fully ready
    setTimeout(() => App.init(), 0);
}
