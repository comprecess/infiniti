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

      // ⚠️ SDK v16 — новый способ запроса разрешений
      const permission = await OneSignal.Notifications.requestPermission()
      console.log('🔔 Разрешение на пуши:', permission)

      // ✅ Получаем ID подписки (subscription ID)
      const userId = await OneSignal.User.getId()
      console.log('✅ OneSignal userId:', userId)

      // Проверка, включены ли пуши
      const isPushEnabled = await OneSignal.Notifications.isPushEnabled()
      console.log('🔔 Пуш разрешён:', isPushEnabled)
    })

    console.log('✅ OneSignal успешно инициализирован (SDK v16)')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
