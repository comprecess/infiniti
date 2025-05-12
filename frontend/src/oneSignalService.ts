import OneSignal from 'react-onesignal'

import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

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

    OneSignal.Slidedown.promptPush()

    if (typeof window !== 'undefined' && window.OneSignal) {
      const userId = await (window as any).OneSignal?.getUserId()

      if (userId) {
        await postKeyPush(userId)

        localStorage.setItem('push_key_sent', 'true')
      } else {
        localStorage.setItem('push_key_sent', 'false')
      }
    } else {
      localStorage.setItem('push_key_sent', 'false')
    }
  } catch (err) {
    localStorage.setItem('push_key_sent', 'false')
  }
}
