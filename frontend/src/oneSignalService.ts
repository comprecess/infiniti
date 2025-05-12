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

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function () {
      await window.OneSignal.init({
        appId,
      })
    })

    const userId = await window.OneSignal.getUserId()

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
