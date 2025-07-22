import {
  authTokenString,
  notificationTokenString,
} from './app/constants/constants'
import { getKeyPush } from './shared/utils/api/Push/get-key-push'
import { postKeyPush } from './shared/utils/api/Push/post-key-push'
import { saveCookies } from './shared/utils/Saving/Cookies/SaveCookies'
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

    if (!response.status) return

    if (!response || !response.data.key) {
      console.error('❌ Не удалось получить appId от сервера')

      return
    }

    const { key: appId } = response.data

    window.OneSignal = window.OneSignal || []

    window.OneSignal.push(function () {
      try {
        window.OneSignal.init({
          appId,
          notifyButton: {
            enable: false,
          },
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

export const subscribeOneSignal = async (deviceName: string) => {
  const sessionToken = getSession(authTokenString)

  if (sessionToken) return

  await initOneSignal()

  window.OneSignal.push(() => {
    window.OneSignal.registerForPushNotifications({
      modalPrompt: true,
    })

    window.OneSignal.on('subscriptionChange', async function () {
      const userId = await window.OneSignal.getUserId()
      // eslint-disable-next-line no-console
      console.log('👤 Новый userId:', userId)

      saveCookies(notificationTokenString, userId, 3600)

      try {
        const { status } = await postKeyPush(userId, deviceName)

        if (!status) {
          throw new Error(`❌ Сервер вернул статус ${status}`)
        }

        // eslint-disable-next-line no-console
        console.log('✅ Player ID успешно сохранён')
        window.location.reload()
      } catch (error) {
        console.error('❌ Ошибка при сохранении Player ID:', error)
      }
    })
  })
}
