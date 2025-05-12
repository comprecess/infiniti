import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
}

let isOneSignalInitialized = false

const waitForOneSignalInit = (): Promise<void> => {
  return new Promise(resolve => {
    window.OneSignal.push(() => {
      resolve()
    })
  })
}

const loadOneSignalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"]',
    )

    if (existingScript) {
      resolve()

      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('❌ Не удалось загрузить OneSignal SDK'))

    document.body.appendChild(script)
  })
}

export const initOneSignal = async () => {
  if (isOneSignalInitialized) return

  try {
    await loadOneSignalScript()

    const response = await getKeyPush()

    if (!response?.key) {
      throw new Error('❌ Не удалось получить appId от сервера')
    }

    const appId = response.key

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true, // <-- это включает плавающую кнопку
        },
      })
    })

    await waitForOneSignalInit()

    isOneSignalInitialized = true
    console.log('✅ OneSignal инициализирован')
  } catch (error) {
    console.error('❌ Ошибка инициализации OneSignal:', error)
  }
}

const savePlayerId = async () => {
  try {
    const userId = await window.OneSignal.getUserId()

    if (!userId) throw new Error('User ID не получен')

    const res = await postKeyPush(userId)

    if (!res.status) throw new Error(`Сервер вернул статус ${res.status}`)

    console.log('✅ Player ID успешно сохранён')
    localStorage.setItem('notificationPermission', 'granted')
  } catch (error) {
    console.error('❌ Ошибка при сохранении Player ID:', error)
  }
}

const removePlayerId = async () => {
  try {
    const userId = await window.OneSignal.getUserId()

    if (userId) {
      // await deleteKeyPush(userId)
      console.log('🗑️ Player ID удалён')
    }
  } catch (error) {
    console.error('❌ Ошибка при удалении Player ID:', error)
  } finally {
    localStorage.setItem('notificationPermission', 'denied')
  }
}

export const handleNotifications = async (
  isEnabled: boolean,
): Promise<NotificationPermission> => {
  if (isEnabled) {
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      localStorage.setItem('notificationPermission', 'denied')

      return permission
    }

    await initOneSignal()

    window.OneSignal.push(() => {
      window.OneSignal.setSubscription(true)
    })

    await savePlayerId()

    return 'granted'
  } else {
    await initOneSignal()

    window.OneSignal.push(() => {
      window.OneSignal.setSubscription(false)
    })

    await removePlayerId()

    return 'denied'
  }
}

export const getNotificationStatus =
  async (): Promise<NotificationPermission> => {
    await initOneSignal()

    const isEnabled = await window.OneSignal.isPushNotificationsEnabled()
    const permission = Notification.permission

    if (permission === 'granted' && isEnabled) {
      return 'granted'
    }

    return permission
  }
