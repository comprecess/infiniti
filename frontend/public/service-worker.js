const APP_VERSION = '0.0.12-alpha.12mw'
const CACHE_NAME = `infiniti-${APP_VERSION}`
const ASSETS_TO_CACHE = ['/']

// Install
self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)))
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', event => {
  console.log('[SW] Activating...')

  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key.startsWith('infiniti-')) {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          }
        }),
      )
    })(),
  )

  self.clients.claim()
})

// Fetch
self.addEventListener('fetch', event => {
  const req = event.request

  // 🔹 Не кэшировать API и POST-запросы (JWT / сессии работают)
  if (req.url.includes('/api/') || req.method !== 'GET') {
    return event.respondWith(fetch(req))
  }

  // 🔹 Кэш для статических ресурсов
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone))
        }
        return response
      })
      return cached || fetchPromise
    }),
  )
})

// Skip waiting (обновление при новой версии)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', async () => {
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(client => client.navigate(client.url))
})
