import { authTokenString, notificationTokenString } from './app/constants/constants'
import { postKeyPush } from './shared/utils/api/Push/post-key-push'
import { saveCookies } from './shared/utils/Saving/Cookies/SaveCookies'
import { getSession } from './shared/utils/Saving/Session/GetSession'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export const subscribeVapidPush = async (deviceName: string): Promise<boolean> => {
  const sessionToken = getSession(authTokenString)
  if (sessionToken) return false

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push not supported in this browser')
    return false
  }

  if (!VAPID_PUBLIC_KEY) {
    console.error('VITE_VAPID_PUBLIC_KEY not set')
    return false
  }

  try {
    // Register service worker (reuse existing if already registered)
    const reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Push permission denied')
      return false
    }

    // Subscribe
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    const sub = subscription.toJSON()
    const endpoint = sub.endpoint!
    const p256dh = sub.keys?.p256dh || ''
    const auth = sub.keys?.auth || ''

    // Save to cookie as unique device ID
    saveCookies(notificationTokenString, endpoint, 3600 * 24 * 365)

    // Send to backend
    const { status } = await postKeyPush(endpoint, deviceName, p256dh, auth)
    if (!status) throw new Error('Backend failed to save push subscription')

    console.log('✅ VAPID push subscription saved')
    return true
  } catch (error) {
    console.error('❌ VAPID subscribe error:', error)
    return false
  }
}

export const getVapidSubscriptionEndpoint = async (): Promise<string | null> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null
  try {
    const reg = await navigator.serviceWorker.getRegistration('/sw.js')
    if (!reg) return null
    const sub = await reg.pushManager.getSubscription()
    return sub?.endpoint || null
  } catch {
    return null
  }
}
