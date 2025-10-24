const CACHE_NAME = 'taskly-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',

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

// INSTALL
self.addEventListener('install', e => {
  console.log("Installing...");

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('Opened cache');

        // safer: cache each file individually
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
  console.log("Activating...");
  e.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            console.log(`Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

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

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const taskId = event.notification.data?.taskId;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                for (let client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.focus();
                        client.postMessage({ action: 'scrollToTask', taskId });
                        return;
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/').then(windowClient => {
                        setTimeout(() => {
                            windowClient.postMessage({ action:'scrollToTask', taskId});
                        }, 2000);
                    })
                }
            })
    );
});