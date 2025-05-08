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

    let permission = localStorage.getItem('notificationPermission')

    if (!permission) {
      // Запрашиваем разрешение, если нет сохраненного
      permission = await Notification.requestPermission()

      localStorage.setItem('notificationPermission', permission)
    }

    if (permission !== 'granted') {
      console.error('❌ Пользователь не дал разрешение на уведомления')

      // Если разрешение отклонено, отписываем пользователя от уведомлений
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        console.log('❌ Уведомления отключены')
      }

      return
    }

    // Получаем публичный VAPID ключ с backend
    const vapidKeyResponse = await getKeyPush()

    if (!vapidKeyResponse || !vapidKeyResponse.key) {
      console.error('❌ Не удалось получить VAPID ключ')

      return
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
    console.log('Текущее состояние разрешения:', Notification.permission)
  } catch (error) {
    console.error('❌ Ошибка при регистрации push-уведомлений:', error)
  }
}

// Инициализация на загрузке страницы
window.addEventListener('load', () => {
  registerPushNotifications()
})
