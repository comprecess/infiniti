/* eslint-disable no-undef */

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

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

  try {
    await loadOneSignalScript()

    const response = await getKeyPush()

    if (!response || !response.key) {
      console.error('❌ Не удалось получить appId от сервера')

      return
    }

    const { key: appId } = response

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(function () {
      try {
        window.OneSignal.init({
          appId,
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        })

        window.OneSignal.isPushNotificationsEnabled(
          (isEnabled: boolean) => {
            console.log('📶 Подписка активна:', isEnabled)

            if (isEnabled) {
              window.OneSignal.getUserId().then(async (userId: string) => {
                console.log('👤 Получен userId из OneSignal:', userId)

                try {
                  const res = await postKeyPush(userId)

                  if (!res.status) {
                    throw new Error(
                      `❌ Сервер вернул статус ${res.status}`,
                    )
                  }

                  console.log('✅ Player ID успешно сохранён')
                } catch (error) {
                  console.error(
                    '❌ Ошибка при сохранении Player ID:',
                    error,
                  )
                }
              })
            } else {
              console.log(
                '🔕 Пользователь не подписан — пропуск отправки Player ID',
              )
            }
          },
        )

        isOneSignalInitialized = true
        console.log('✅ OneSignal инициализирован')
      } catch (error) {
        console.error('❌ Ошибка при инициализации OneSignal:', error)
      }
    })
  } catch (error) {
    console.error(
      '❌ Ошибка при загрузке OneSignal SDK или получении данных:',
      error,
    )
  }
}

export const handleNotifications = async (
  isEnabled: boolean,
): Promise<NotificationPermission> => {
  if (isEnabled) {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      await initOneSignal()

      return new Promise(resolve => {
        window.OneSignal.push(() => {
          window.OneSignal.showSlidedownPrompt()

          // Подпишемся на изменения
          window.OneSignal.on(
            'subscriptionChange',
            async (isSubscribed: boolean) => {
              console.log('🔁 subscriptionChange:', isSubscribed)

              if (isSubscribed) {
                try {
                  const userId = await window.OneSignal.getUserId()
                  console.log('👤 Получен userId из OneSignal:', userId)

                  const res = await postKeyPush(userId)

                  if (!res.status)
                    throw new Error(
                      `❌ Сервер вернул статус ${res.status}`,
                    )

                  localStorage.setItem('notificationPermission', 'granted')
                } catch (error) {
                  console.error(
                    '❌ Ошибка при сохранении Player ID:',
                    error,
                  )
                }

                resolve('granted')
              } else {
                resolve('default')
              }
            },
          )
        })
      })
    } else {
      localStorage.setItem('notificationPermission', 'denied')

      return permission
    }
  } else {
    if (window.OneSignal) {
      window.OneSignal.push(() => {
        window.OneSignal.setSubscription(false)
      })
    }

    localStorage.setItem('notificationPermission', 'denied')

    return 'denied'
  }
}
