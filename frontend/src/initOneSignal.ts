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
        autoResubscribe: true,
        notifyButton: { enable: false },
        welcomeNotification: {
          title: 'Добро пожаловать!',
          message: 'Вы подписались на уведомления!',
          url: '/',
        },
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

    const isSubscribed = await window.OneSignal.getSubscription()
    if (!isSubscribed) {
      window.OneSignal.push(() => {
        window.OneSignal.showNativePrompt()
      })
    }

    const userId = await window.OneSignal.getUserId()
    if (userId) {
      await postKeyPush(userId)
      await window.OneSignal.login(userId)
      console.log('✅ Player ID sent and logged in')
    }

    return 'granted'
  }

export const unsubscribeFromPush = async (): Promise<void> => {
  await initOneSignal()
  await window.OneSignal.setSubscription(false)

  const userId = await window.OneSignal.getUserId()
  if (userId) {
    await window.OneSignal.logout()
    console.log('🗑️ Player ID unsubscribed and logged out:', userId)
  }
}

export const getNotificationStatus =
  async (): Promise<NotificationPermission> => {
    await initOneSignal()

    const isSubscribed = await window.OneSignal.getSubscription()
    const permission = Notification.permission

    if (permission === 'granted' && isSubscribed) return 'granted'
    if (permission === 'denied') return 'denied'

    return 'default'
  }
