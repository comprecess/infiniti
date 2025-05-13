/* eslint-disable no-undef */

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
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

export const initOneSignal = async () => {
  try {
    await loadOneSignalScript()

    const response = await getKeyPush()
    if (!response?.key)
      throw new Error('❌ Не удалось получить appId от сервера')

    const appId = response.key
    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId,
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
      })

      // Ждём полной инициализации SDK
      window.OneSignal.on('initialized', async () => {
        console.log('📦 OneSignal полностью инициализирован')

        // Теперь безопасно вызывать promptPush
        if (window.OneSignal.Slidedown) {
          window.OneSignal.Slidedown.promptPush()
        }

        // Обработка подписки
        window.OneSignal.on(
          'subscriptionChange',
          async (isSubscribed: boolean) => {
            console.log('🔄 Изменение подписки:', isSubscribed)
            if (isSubscribed) {
              await savePlayerId()
            }
          },
        )

        console.log('✅ OneSignal инициализирован')
      })
    })
  } catch (error) {
    console.error('❌ Ошибка инициализации OneSignal:', error)
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
