// Retired — merged into firebase-messaging-sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.registration.unregister();
  self.clients.claim();
});
