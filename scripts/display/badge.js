import { countOverdueTasks } from '../utils/dateFormatter.js';
import { tasks } from '../tasks.js';

let isAppActive = true;

// 🔹 Count overdue tasks in the app
function updateAppBadge() {
  if (!('setAppBadge' in navigator)) return;
  const overdueCount = countOverdueTasks(tasks);

  if (overdueCount > 0) {
    navigator.setAppBadge(overdueCount);
  } else {
    navigator.clearAppBadge();
  }
}

// Send tasks to Service Worker for offline badge handling
function syncTasksToSW() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'syncTasks',
      tasks,
      appActive: isAppActive,
    });
  }
}

// Force the Service Worker to update badge immediately
export async function updateBadgeImmediately() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  if (reg.active) {
    reg.active.postMessage({ action: 'updateBadgeNow', tasks });
  }
}

// Run badge updates while the app is open
function startBadgeUpdater() {
  updateAppBadge();
  syncTasksToSW();
  setInterval(() => {
    updateAppBadge();
    syncTasksToSW();
  }, 10000);
  console.log('Badge updater started');
}

// Handle visibility changes — switch control between app and SW
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // App hidden → SW takes over
    isAppActive = false;
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'takeOverBadge',
        tasks,
      });
    }
  } else {
    // App visible → app takes over badge
    isAppActive = true;
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'releaseBadge',
      });
    }
    updateAppBadge();
  }
});

// Optional focus handler (refreshes badge on refocus)
window.addEventListener('focus', () => {
  isAppActive = true;
  updateAppBadge();
  syncTasksToSW();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(() => {
    console.log('Service Worker ready, starting badge updater...');
    startBadgeUpdater();
  });
} else {
  // Fallback (e.g. non-PWA environment)
  startBadgeUpdater();
}