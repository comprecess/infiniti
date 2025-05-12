import OneSignal from 'react-onesignal'

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'

export const initPushNotifications = async (): Promise<void> => {
  try {
    const { key: appId } = (await getKeyPush()) || {}

    if (!appId) {
      console.error('❌ Ошибка: appId не получен с сервера')

      return
    }

    await OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: true,
      autoResubscribe: true,
      welcomeNotification: {
        title: 'Добро пожаловать!',
        message: 'Вы подписались на уведомления!',
        url: '/',
      },
    })

    OneSignal.Slidedown.promptPush()

    console.log('✅ OneSignal инициализирован и уведомления запрашиваются')
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
  }
}
