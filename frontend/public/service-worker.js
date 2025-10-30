const APP_VERSION = '0.0.8-alpha.8cr'
const CACHE_NAME = `infiniti-${APP_VERSION}`
const ASSETS_TO_CACHE = ['/']

self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key)
        }),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const req = event.request
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(response => {
        if (response && response.status === 200 && req.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone))
        }
        return response
      })
      return cached || fetchPromise
    }),
  )
})

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
