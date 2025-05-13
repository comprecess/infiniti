import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'

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

      window.OneSignal.getUserId()
        .then((userId: string) => {
          console.log('📬 Push token:', userId)
        })
        .catch((err: any) => {
          console.error('❌ Ошибка при получении Push токена:', err)
        })
    })

    console.log('✅ OneSignal инициализация запущена')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
