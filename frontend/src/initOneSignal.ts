/* eslint-disable no-undef */

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
}

let isOneSignalInitialized = false

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
  if (isOneSignalInitialized) {
    console.log('📌 OneSignal уже инициализирован')

    return
  }

  await loadOneSignalScript()

  const response = await getKeyPush()

  if (!response || !response.key) {
    console.error('❌ Не удалось получить appId от сервера')

    return
  }

  const { key: appId } = response

  window.OneSignal = window.OneSignal || []

  window.OneSignal.push(function () {
    window.OneSignal.init({
      appId,
      notifyButton: {
        enable: true,
      },
      allowLocalhostAsSecureOrigin: true,
    })
  })

  window.OneSignal.push(function () {
    window.OneSignal.on(
      'subscriptionChange',
      function (isSubscribed: boolean) {
        if (isSubscribed) {
          window.OneSignal.getUserId().then(function (userId: string) {
            fetch('/save-player-id', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ player_id: userId }),
            })
          })
        }
      },
    )
  })

  isOneSignalInitialized = true
  console.log('✅ OneSignal инициализирован')
}

export const handleNotifications = async (isEnabled: boolean) => {
  if (isEnabled) {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      await initOneSignal()

      localStorage.setItem('notificationPermission', 'granted')
    } else {
      console.log('❌ Разрешение на уведомления отклонено')

      localStorage.setItem('notificationPermission', 'denied')
    }
  } else {
    if (window.OneSignal) {
      window.OneSignal.push(function () {
        window.OneSignal.setSubscription(false)
      })
    }

    localStorage.setItem('notificationPermission', 'denied')
  }
}
