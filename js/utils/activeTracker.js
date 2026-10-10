// ============================================================================
// ActiveTracker — Automated Active User Time Tracker for KPI Master
// Tracks active time spent on Trello & WebApp per member.
// Automatically pauses when user is idle (>60s no activity) or tab is hidden.
// ============================================================================

window.ActiveTracker = (function () {
  var IDLE_TIMEOUT_MS = 60000; // 60 seconds idle threshold
  var TICK_INTERVAL_MS = 5000;  // 5 seconds tick
  var STORAGE_KEY = 'kpi_user_active_time_data';

  var isTracking = false;
  var isIdle = false;
  var isTabHidden = false;
  var lastActivityTime = Date.now();
  var currentUser = { id: null, name: 'Utilizador' };

  function getTodayKey() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function resetIdleTimer() {
    lastActivityTime = Date.now();
    if (isIdle) {
      isIdle = false;
      updateMemberState(true, false);
    }
  }

  function updateMemberState(isOnline, isIdleState) {
    var data = loadData();
    var todayKey = getTodayKey();
    if (!currentUser.id) return;
    var key = currentUser.id;

    if (!data[key]) {
      data[key] = {
        id: currentUser.id || key,
        name: currentUser.name || key,
        days: {},
        lastSeen: Date.now(),
        isOnline: isOnline,
        isIdle: isIdleState
      };
    }

    data[key].lastSeen = Date.now();
    data[key].isOnline = isOnline;
    data[key].isIdle = isIdleState;
    if (!data[key].days) data[key].days = {};
    if (typeof data[key].days[todayKey] !== 'number') {
      data[key].days[todayKey] = 0;
    }

    saveData(data);
  }

  function addActiveSeconds(seconds) {
    var data = loadData();
    var todayKey = getTodayKey();
    if (!currentUser.id) return;
    var key = currentUser.id;

    if (!data[key]) {
      data[key] = {
        id: currentUser.id || key,
        name: currentUser.name || key,
        days: {},
        lastSeen: Date.now(),
        isOnline: true,
        isIdle: false
      };
    }

    if (!data[key].days) data[key].days = {};
    data[key].days[todayKey] = (data[key].days[todayKey] || 0) + seconds;
    data[key].lastSeen = Date.now();
    data[key].isOnline = true;
    data[key].isIdle = false;

    saveData(data);
  }

  function tick() {
    if (!isTracking) return;

    var now = Date.now();
    if (document.hidden) {
      isTabHidden = true;
      updateMemberState(false, false);
      return;
    } else {
      isTabHidden = false;
    }

    if (now - lastActivityTime > IDLE_TIMEOUT_MS) {
      isIdle = true;
      updateMemberState(true, true); // Online but Idle
      return;
    }

    // User is active and interacting! Add active seconds
    addActiveSeconds(TICK_INTERVAL_MS / 1000);
  }

  function init(user) {
    if (user && user.name) {
      currentUser = user;
    }

    if (isTracking) return;
    isTracking = true;

    // Activity Event Listeners
    var events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(function (evt) {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        isTabHidden = true;
        updateMemberState(false, false);
      } else {
        isTabHidden = false;
        resetIdleTimer();
      }
    });

    updateMemberState(true, false);
    setInterval(tick, TICK_INTERVAL_MS);
  }

  function formatTime(totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return '0m';
    var hrs = Math.floor(totalSeconds / 3600);
    var mins = Math.floor((totalSeconds % 3600) / 60);

    if (hrs > 0) {
      return hrs + 'h ' + mins + 'm';
    }
    return mins + 'm';
  }

  function getStats() {
    if (!currentUser.id) return [];
    var data = loadData();
    var todayKey = getTodayKey();
    var now = Date.now();
    var membersList = [];

    // Calculate start of current week (Monday)
    var curr = new Date();
    var firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));

    Object.keys(data).forEach(function (name) {
      var member = data[name];
      var todaySecs = member.days ? (member.days[todayKey] || 0) : 0;

      // Weekly total
      var weeklySecs = 0;
      if (member.days) {
        Object.keys(member.days).forEach(function (dateStr) {
          var parts = dateStr.split('-');
          if (parts.length === 3) {
            var dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            if (dateObj >= firstDayOfWeek) {
              weeklySecs += member.days[dateStr];
            }
          }
        });
      }

      var diffSecs = Math.floor((now - (member.lastSeen || 0)) / 1000);
      var status = 'offline';
      var statusText = 'Offline';
      var statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';

      if (diffSecs < 120 && member.isOnline && !member.isIdle) {
        status = 'online';
        statusText = 'Ativo Agora';
        statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      } else if (diffSecs < 300 && (member.isIdle || diffSecs < 300)) {
        status = 'idle';
        statusText = 'Inativo (Idle)';
        statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      }

      membersList.push({
        id: member.id || name,
        name: member.name || name,
        todaySeconds: todaySecs,
        todayFormatted: formatTime(todaySecs),
        weeklySeconds: weeklySecs,
        weeklyFormatted: formatTime(weeklySecs),
        status: status,
        statusText: statusText,
        statusColor: statusColor,
        lastSeen: member.lastSeen
      });
    });

    membersList.sort(function (a, b) {
      return b.todaySeconds - a.todaySeconds;
    });

    var isAdmin = !!(window.App && window.App.state && window.App.state.isBoardAdmin);
    return isAdmin ? membersList : membersList.filter(function (member) {
      return member.id === currentUser.id;
    });
  }

  return {
    init: init,
    getStats: getStats,
    formatTime: formatTime
  };
})();
