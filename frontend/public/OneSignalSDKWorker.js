importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')

try {
  const APP_VERSION = '0.0.16-alpha.16jz'
  const CACHE_NAME = `infiniti-${APP_VERSION}`
  const ASSETS_TO_CACHE = ['/']

  self.addEventListener('install', event => {
    console.log('[INF SW] Installing...')

    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)))
    self.skipWaiting()
  })

  self.addEventListener('activate', event => {
    console.log('[INF SW] Activating...')

    event.waitUntil(
      (async () => {
        const keys = await caches.keys()
        await Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME && key.startsWith('infiniti-')) {
              console.log('[INF SW] Deleting old cache:', key)
              return caches.delete(key)
            }
          }),
        )
      })(),
    )
    self.clients.claim()
  })

  self.addEventListener('fetch', event => {
    const req = event.request

    if (req.url.includes('/api/') || req.method !== 'GET') return
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
} catch (e) {
  console.error('[INF SW] Error in custom logic:', e)
}
