const cacheName = 'my-cache-v1'
const cacheAssets = [
  '/',
  '/index.html',
  // Можно добавить пути к ресурсам, которые нужно кэшировать
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheAssets)
    }),
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    }),
  )
})
