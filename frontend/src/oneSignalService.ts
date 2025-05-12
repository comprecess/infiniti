import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
    OneSignalDeferred: any
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

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(function () {
      window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
      })

      window.OneSignal.getUserId().then(async function (userId: string) {
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

      window.OneSignal.Slidedown.promptPush?.()
    })
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
    localStorage.setItem('push_key_sent', 'false')
  }
}
