import { getKeyPush } from './shared/utils/api/Push/GetKeyPush'
import { postKeyPush } from './shared/utils/api/Push/PostKeyPush'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('❌ Push уведомления не поддерживаются в этом браузере')

    return
  }

  try {
    // Регистрируем service worker
    const registration = await navigator.serviceWorker.register(
      '/service-worker.js',
    )

    console.log('✅ Service Worker зарегистрирован:')

    // Запрашиваем разрешение на уведомления
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.error('❌ Пользователь не дал разрешение на уведомления')

      return
    }

    // Получаем публичный VAPID ключ с backend
    const vapidKeyResponse = await getKeyPush()

    if (!vapidKeyResponse || !vapidKeyResponse.key) {
      console.error('❌ Не удалось получить VAPID ключ')
    }

    const { key: publicKey } = vapidKeyResponse

    // Подписываем пользователя на push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })

    // Отправляем подписку на backend
    await postKeyPush(subscription)

    console.log('✅ Подписка успешно отправлена на сервер')
  } catch (error) {
    console.error('❌ Ошибка при регистрации push-уведомлений:', error)
  }
}

// Инициализация на загрузке страницы
window.addEventListener('load', () => {
  registerPushNotifications()
})
