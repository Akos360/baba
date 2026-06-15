// ── Caching
const CACHE = 'baba-v3';
const ASSETS = ['dates.html', 'index.html', 'manifest.json',
  'img/hehe2.jpg', 'img/yippe.jpg', 'img/cic.jpg', 'img/cic2.jpg', 'img/gym.jpg'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'baba 💕', {
      body:    data.body  || '',
      icon:    '/img/hehe2.jpg',
      badge:   '/img/hehe2.jpg',
      vibrate: [200, 100, 200],
      data:    { url: '/dates.html' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/dates.html'));
});
