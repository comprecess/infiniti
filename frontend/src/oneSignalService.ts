import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

declare global {
  interface Window {
    OneSignal: any
  }
}

export const initOneSignal = async () => {
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
      console.log('👤 Новый userId:', userId)

      try {
        const res = await postKeyPush(userId)

        if (!res.status) {
          throw new Error(`❌ Сервер вернул статус ${res.status}`)
        }

        console.log('✅ Player ID успешно сохранён')
      } catch (error) {
        console.error('❌ Ошибка при сохранении Player ID:', error)
      }
    })
  })
}
