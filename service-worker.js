const cacheName = 'version-v1'
const cacheAssets = [
  '/index.html',
  '/icons/',
  '/src/app/styles/globals.scss',
  '/src/shared/styles/variables/',
  '/src/shared/styles/mixins/',
  '/src/shared/icons/',
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
