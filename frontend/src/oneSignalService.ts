import OneSignal from 'react-onesignal'

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare module 'react-onesignal' {
  interface IOneSignalOneSignal {
    getUserId: () => Promise<string | null>
  }
}

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
    })

    OneSignal.Slidedown.promptPush?.()

    const userId = await window.OneSignal?.getUserId()

    if (userId) {
      await postKeyPush(userId)
      localStorage.setItem('push_key_sent', 'true')
    } else {
      localStorage.setItem('push_key_sent', 'false')
    }
  } catch (err) {
    console.error('❌ Ошибка при инициализации OneSignal:', err)
    localStorage.setItem('push_key_sent', 'false')
  }
}
