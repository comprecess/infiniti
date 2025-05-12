import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'

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

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function () {
      await window.OneSignal.init({
        appId,
      })
    })

    window.OneSignal.Slidedown.promptPush?.()
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
