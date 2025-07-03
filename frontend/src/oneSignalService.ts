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
    try {
      await window.OneSignal.setSubscription(false)
    } catch (e) {
      console.warn("Couldn't unsubscribe via SDK", e)
    }
  }

  Object.keys(localStorage).forEach(key => {
    if (/onesignal|OneSignal/i.test(key)) {
      localStorage.removeItem(key)
    }
  })

  Object.keys(sessionStorage).forEach(key => {
    if (/onesignal|OneSignal/i.test(key)) {
      sessionStorage.removeItem(key)
    }
  })

  if ('serviceWorker' in navigator) {
    try {
      const registrations =
        await navigator.serviceWorker.getRegistrations()
      await Promise.all(
        registrations.map(reg => {
          if (/onesignal/i.test(reg.scope)) return reg.unregister()
        }),
      )
    } catch (e) {
      console.warn('Service Worker unregister failed', e)
    }
  }

  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim()
    if (/onesignal/i.test(name)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  })

  delete window.OneSignal

  document
    .querySelectorAll('script[src*="onesignal"]')
    .forEach(script => script.remove())

  window.location.reload()
}
