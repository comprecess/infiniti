import { authTokenString } from './app/constants/constants'
import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'
import { getSession } from './shared/utils/Saving/Session/GetSession'

declare global {
  interface Window {
    OneSignal: any
  }
}

export const initOneSignal = async () => {
  const sessionToken = getSession(authTokenString)

  if (sessionToken) return

  try {
    const response = await getKeyPush()

    if (!response || !response.key) {
      console.error('❌ Не удалось получить appId от сервера')

      return
    }

    const { key: appId } = response

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(function () {
      try {
        window.OneSignal.init({
          appId,
          notifyButton: {
            enable: false,
          },
          allowLocalhostAsSecureOrigin: true,
        })

        // eslint-disable-next-line no-console
        console.log('✅ OneSignal инициализирован')
      } catch (error) {
        console.error('❌ Ошибка при инициализации OneSignal:', error)
      }
    })
  } catch (error) {
    console.error(
      '❌ Ошибка при загрузке OneSignal SDK или получении данных:',
      error,
    )
  }
}

export const subscribeOneSignal = async () => {
  await initOneSignal()

  window.OneSignal.push(() => {
    window.OneSignal.registerForPushNotifications({
      modalPrompt: true,
    })

    window.OneSignal.on('subscriptionChange', async function () {
      const userId = await window.OneSignal.getUserId()
      // eslint-disable-next-line no-console
      console.log('👤 Новый userId:', userId)

      try {
        const res = await postKeyPush(userId)

        if (!res.status) {
          throw new Error(`❌ Сервер вернул статус ${res.status}`)
        }

        // eslint-disable-next-line no-console
        console.log('✅ Player ID успешно сохранён')
      } catch (error) {
        console.error('❌ Ошибка при сохранении Player ID:', error)
      }
    })
  })
}

export const clearOneSignalData = async () => {
  if (window.OneSignal) {
    window.OneSignal.push(() => {
      window.OneSignal.logout()
    })

    delete window.OneSignal

    const keys = Object.keys(localStorage).filter(key =>
      key.includes('onesignal'),
    )

    keys.forEach(key => localStorage.removeItem(key))
  }
}
