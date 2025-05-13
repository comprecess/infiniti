import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
    OneSignalDeferred: any[]
  }
}

export const initPushNotifications = async (): Promise<void> => {
  try {
    const response = await getKeyPush()
    const appId = response?.key

    if (!appId) {
      console.error('❌ Ошибка: appId не получен с сервера')

      return
    }

    window.OneSignalDeferred = window.OneSignalDeferred || []

    window.OneSignalDeferred.push(async function () {
      await window.OneSignal.init({
        appId,
        notifyButton: { enable: false },
      })

      window.OneSignal.Slidedown.promptPush()

      window.OneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
        console.log('📶 Подписка активна:', isEnabled)

        if (isEnabled) {
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
        } else {
          console.log(
            '🔕 Пользователь не подписан — пропуск отправки Player ID',
          )
        }
      })
    })

    console.log('✅ OneSignal инициализация запущена')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
