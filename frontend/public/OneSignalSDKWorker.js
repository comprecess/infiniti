importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')

try {
  const APP_VERSION = '0.0.18-alpha.18fz'

  self.addEventListener('install', event => {
    console.log('[INF SW] Installing version', APP_VERSION)
    self.skipWaiting()
  })

  self.addEventListener('activate', event => {
    console.log('[INF SW] Activating version', APP_VERSION)
    event.waitUntil(
      (async () => {
        const keys = await caches.keys()
        await Promise.all(
          keys.map(key => {
            console.log('[INF SW] Deleting cache:', key)
            return caches.delete(key)
          }),
        )
      })(),
    )
    self.clients.claim()
  })
} catch (e) {
  console.error('[INF SW] Error in custom logic:', e)
}
