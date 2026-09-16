// This service worker exists only to handle push notifications. It
// deliberately does NOT intercept fetch requests or keep its own Cache
// Storage — that layer used to shadow the app's own Cache-Control headers,
// serving an old cached dates.html back even after force-quitting and
// reopening the app on iOS. Every request now just goes straight to the
// network, the same way the sibling "beer" app's service worker already
// behaves (which is why that one always refreshes reliably).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  // Clean up the old per-page cache this SW used to maintain, so a
  // previously-stored stale copy can never be read back by anything.
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
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
