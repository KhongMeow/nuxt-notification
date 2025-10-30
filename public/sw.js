self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || '/';
  const open = async (target) => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = allClients.find(c => 'url' in c && c.url.includes(target));
    if (existing) {
      existing.focus();
      return;
    }
    await self.clients.openWindow(target);
  };

  event.waitUntil((async () => {
    if (event.action === 'open') {
      await open(url);
    } else if (event.action === 'dismiss') {
      // no-op
    } else {
      await open(url);
    }
  })());
});