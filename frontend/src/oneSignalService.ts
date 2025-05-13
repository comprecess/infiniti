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
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      await OneSignal.init({
        appId,
        notifyButton: { enable: false },
      })

      window.OneSignal.showSlidedownPrompt()

      const userId = await window.OneSignal.user.getId()
      console.log('✅ OneSignal userId:', userId)

      const isPushEnabled = await window.OneSignal.user.isPushEnabled()
      console.log('🔔 Push разрешён:', isPushEnabled)
    })

    console.log('✅ OneSignal успешно инициализирован (SDK v16)')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
