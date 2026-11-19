/* FleetSight service worker: makes the app installable and usable offline after the first visit. */
const CACHE = 'fleetsight-v1';
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/favicon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Pages: try the network first so updates show straight away; fall back to the saved copy offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('/index.html', copy)); return res; })
      .catch(() => caches.match('/index.html')));
    return;
  }
  // Libraries, fonts and icons: use the saved copy if we have one, otherwise fetch and save it.
  const isLib = /(^|\.)cdn\.jsdelivr\.net$|(^|\.)cdnjs\.cloudflare\.com$|fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (isLib || url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
