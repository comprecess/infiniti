const CACHE_NAME = 'infiniti-v2'

const ASSETS_TO_CACHE = ['/index.html']

// Кэширование ресурсов при установке
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
})

// Очистка старых кэшей при активации
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
})

// Отдача ресурсов из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  )
})

// Обработка входящего push-сообщения
self.addEventListener('push', event => {
  const data = event.data?.json() || {}

  const title = data.title || 'Новое уведомление'
  const options = {
    body: data.body || 'У вас новое сообщение.',
    icon: '/logoPWA/logoPWA(512x512).png',
    badge: '/logoPWA/logoPWA(256x256).png',
    data: {
      url: data.url || '/',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      }),
  )
})
