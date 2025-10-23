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
    '/scripts/utils/dateFormatter.js',
    '/scripts/utils/dayjs.min.js',

    //Images
    '/imgs/apple-touch-icon.png', 
    '/imgs/bright-sky.jpg', 
    '/imgs/dark-sky.jpg', 
    '/imgs/Taskly-logo-192.png', 
    '/imgs/Taskly-logo-512.png', 
    '/imgs/Taskly-logo.svg', 
    '/imgs/Taskly-writing-dark.svg'
];

self.addEventListener('install', e => {
    console.log("Installing...");
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache')
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log("Cached successfully...");
                return self.skipWaiting();
            })
            .catch(err => console.log('Failed', err))
    )
})

self.addEventListener('activate', e => {
    console.log("Activating...");
    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                        console.log('Deleted old cache');
                    })
                )
            })
    );

    self.clients.claim();
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => res || fetch(e.request))
    );
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Taskly Notification';
    const options = {
        body: data.body || 'You have a task reminder',
        icon: '/imgs/Taskly-logo-black-192.png',
        badge: '/imgs/Taskly-logo-black-192.png',
        tag: data.tag || 'taskly-notification',
        requireInteraction: true
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
                    return clients.openWindow('/');
                }
            })
    );
});
