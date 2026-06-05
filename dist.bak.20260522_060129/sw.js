// Infiniti Push Service Worker
self.addEventListener('push', function (event) {
  let data = { title: 'Infiniti', body: '', url: '/' }
  try {
    data = event.data ? event.data.json() : data
  } catch (e) {
    data.body = event.data ? event.data.text() : ''
  }

  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Infiniti', options)
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))
