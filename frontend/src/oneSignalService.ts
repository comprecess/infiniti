import { deleteKeyPush } from './shared/utils/api/Push/DeleteKeyPush'
import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
}

export const initOneSignal = async () => {
  try {
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

        window.OneSignal.isPushNotificationsEnabled(() => {
          window.OneSignal.getUserId().then(async (userId: string) => {
            console.log('👤 Получен userId из OneSignal:', userId)

            try {
              const res = await postKeyPush(userId)

              if (!res.status) {
                throw new Error(`❌ Сервер вернул статус ${res.status}`)
              }

              console.log('✅ Player ID успешно сохранён')
            } catch (error) {
              console.error('❌ Ошибка при сохранении Player ID:', error)
            }
          })
        })

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

export const subscribeOneSignal = () => {
  window.OneSignal.push(() => {
    window.OneSignal.isPushNotificationsEnabled(() => {
      window.OneSignal.getUserId().then(async (userId: string) => {
        console.log('👤 Получен userId из OneSignal:', userId)

        try {
          const res = await postKeyPush(userId)

          if (!res.status) {
            throw new Error(`❌ Сервер вернул статус ${res.status}`)
          }

          console.log('✅ Player ID успешно сохранён')
        } catch (error) {
          console.error('❌ Ошибка при сохранении Player ID:', error)
        }
      })
    })

    console.log('🔕 Пользователь подписался на уведомления')
  })
}

export const unSubscribeOneSignal = () => {
  window.OneSignal.push(() => {
    window.OneSignal.setSubscription(false)
    window.OneSignal.getUserId().then(async (userId: string) => {
      console.log('👤 User ID:', userId)

      try {
        const res = await deleteKeyPush(userId)

        if (!res.status) {
          throw new Error(`❌ Сервер вернул статус ${res.status}`)
        }

        console.log('✅ Player ID успешно удалён с сервера')
      } catch (error) {
        console.error('❌ Ошибка при удалении Player ID:', error)
      }
    })

    console.log('🔕 Пользователь отписан от уведомлений')
  })
}

export const getOneSignalSubscriptionStatus = (): Promise<boolean> => {
  return new Promise(resolve => {
    window.OneSignal.push(() => {
      window.OneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
        resolve(isEnabled)
      })
    })
  })
}
