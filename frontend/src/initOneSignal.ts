import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
}

let isInitialized = false

const loadSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="OneSignalSDK.js"]')) {
      return resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('❌ OneSignal SDK load failed'))

    document.body.appendChild(script)
  })
}

const waitForInit = (): Promise<void> => {
  return new Promise(resolve => {
    window.OneSignal.push(() => resolve())
  })
}

export const initOneSignal = async (): Promise<void> => {
  if (isInitialized) return

  try {
    await loadSDK()

    const { key: appId } = (await getKeyPush()) || {}

    if (!appId) throw new Error('❌ No appId returned from server')

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
      })
    })

    await waitForInit()
    isInitialized = true
    console.log('✅ OneSignal initialized')
  } catch (err) {
    console.error('❌ OneSignal init error:', err)
  }
}

export const subscribeToPush =
  async (): Promise<NotificationPermission> => {
    await initOneSignal()

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return permission

    await window.OneSignal.setSubscription(true)
    const userId = await window.OneSignal.getUserId()

    if (userId) {
      await postKeyPush(userId)
      console.log('✅ Player ID sent to backend')
    }

    return 'granted'
  }

export const unsubscribeFromPush = async (): Promise<void> => {
  await initOneSignal()
  await window.OneSignal.setSubscription(false)

  const userId = await window.OneSignal.getUserId()
  if (userId) {
    console.log('🗑️ Player ID unsubscribed:', userId)
    // Optionally: await deleteKeyPush(userId)
  }
}

export const getNotificationStatus =
  async (): Promise<NotificationPermission> => {
    await initOneSignal()

    const isEnabled = await window.OneSignal.isPushNotificationsEnabled()
    const permission = Notification.permission

    if (isEnabled && permission === 'granted') {
      return 'granted'
    }

    return permission
  }
