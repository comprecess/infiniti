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
      const OneSignal = window.OneSignal

      await OneSignal.init({
        appId,
        notifyButton: { enable: false },
      })

      // Запрос на разрешение
      const permission = await OneSignal.Notifications.requestPermission()
      console.log('🔔 Разрешение на пуши:', permission)

      // Получаем userId
      const user = await OneSignal.User.get()
      const userId = user.id
      console.log('✅ OneSignal userId:', userId)

      // Проверяем статус
      const isPushEnabled = await OneSignal.Notifications.isPushEnabled()
      console.log('🔔 Push разрешён:', isPushEnabled)
    })

    console.log('✅ OneSignal инициализация запущена')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
