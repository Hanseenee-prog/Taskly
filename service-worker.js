const CACHE_NAME = 'taskly-v1.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',

  // CSS
  '/css/style.css',
  '/css/splash-screen.css',

  //JS
  '/scripts/scripts.js',
  '/scripts/taskControls.js',
  '/scripts/tasks.js',
  '/scripts/toggleBtn.js',
  '/scripts/display/addorUpdateTask.js',
  '/scripts/display/displayTasks.js',
  '/scripts/display/notification.js',
  '/scripts/display/popups.js',
  '/scripts/display/installUI.js',
  '/scripts/display/badge.js',
  '/scripts/utils/dateFormatter.js',
  '/scripts/utils/dayjs.min.js',

  // Images
  '/imgs/apple-touch-icon.png',
  '/imgs/bright-sky.jpg',
  '/imgs/dark-sky.jpg',
  '/imgs/Taskly-logo-192.png',
  '/imgs/Taskly-logo-512.png',
  '/imgs/Taskly-logo.svg',
  '/imgs/Taskly-writing-dark.svg'
];

let cachedTasks = [];
let shouldUpdateBadge = false;

// INSTALL
self.addEventListener('install', e => {
  console.log("Installing...");

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('Opened cache');

        for (const url of urlsToCache) {
          try {
            await cache.add(url);
            console.log(`Cached: ${url}`);
          } catch (err) {
            console.warn(`Failed to cache ${url}:`, err);
          }
        }

        return self.skipWaiting();
      })
  );
});

// ACTIVATE
self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map(name => name !== CACHE_NAME && caches.delete(name))
      );
      await self.clients.claim();
      await updateBadgeFromCachedTasks(); 
    })()
  );
});

self.addEventListener('periodicsync', e => {
  if (e.tag === 'update-badge') e.waitUntil(updateBadgeFromCachedTasks());
})

// FETCH
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        if (response) return response;

        return fetch(e.request)
          .then(networkRes => {
            // Cache new files as they're fetched
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(e.request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => {
            // Fallback to index.html for navigation requests
            if (e.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// PUSH NOTIFICATIONS
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Taskly Notification';
  const options = {
    body: data.body || 'You have a task reminder',
    icon: '/imgs/Taskly-logo-192.png',
    badge: '/imgs/Taskly-logo-192.png',
    tag: data.tag || 'taskly-notification',
    requireInteraction: true,
    data: data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


// NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const taskId = event.notification.data?.taskId;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    for (let client of clientList) {
      if (client.url.includes(self.location.origin) && 'focus' in client) {
        try {
          await client.focus();
          client.postMessage({ action: 'scrollToTask', taskId });
          return;
        } catch (err) {
          console.warn('Focus blocked:', err);
        }
      }
    }

    if (clients.openWindow) {
      try {
        const windowClient = await clients.openWindow('/');
        setTimeout(() => windowClient?.postMessage({ action: 'scrollToTask', taskId }), 2000);
      } catch (err) {
        console.warn('Open window blocked:', err);
      }
    }
  })());
});

self.addEventListener('message', e => {
  const { action, tasks, appActive } = e.data || {};

  if (action === 'syncTasks') {
    cachedTasks = tasks || [];
    if (!appActive && shouldUpdateBadge) updateBadgeFromCachedTasks();
  }

  if (action === 'takeOverBadge') {
    shouldUpdateBadge = true;
    updateBadgeFromCachedTasks();
  }

  if (action === 'releaseBadge') {
    shouldUpdateBadge = false;
  }

  if (action === 'updateBadgeNow') {
    cachedTasks = tasks || [];
    updateBadgeFromCachedTasks();
  }

  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// BADGE UPDATE
async function updateBadgeFromCachedTasks() {
  try {
    const overdueCount = countOverdueTasks(cachedTasks);
    if (!'setAppBadge' in self.navigator) return;

    if (overdueCount > 0) {
      await self.navigator.setAppBadge(overdueCount);
      console.log(`✅ Badge set to ${overdueCount}`);
    } else {
      await self.navigator.clearAppBadge();
      console.log('✅ Badge cleared');
    }
    
  } catch (err) {
    console.error('❌ Badge update failed:', err);
  }
}

function countOverdueTasks(tasks) {
  const now = new Date();
  return Array.isArray(tasks)
    ? tasks.filter(task => {
        const taskDateTime = new Date(`${task.date} ${task.time}`);
        return taskDateTime < now && !task.completed;
      }).length
    : 0;
}