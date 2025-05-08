import { useEffect, useState } from 'react'

import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import styles from './SwitchNotifications.module.scss'

export const SwitchNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission | null>(null)

  const requestNotificationPermission = async () => {
    try {
      const permissionResult = await Notification.requestPermission()

      setPermission(permissionResult)

      localStorage.setItem('notificationPermission', permissionResult)
    } catch (error) {
      console.error('Ошибка при запросе разрешения:', error)
    }
  }

  const handleSwitchChange = async (isEnabled: boolean) => {
    if (isEnabled) {
      await requestNotificationPermission()

      console.log('✅ Уведомления подключены')
    } else {
      setPermission('denied')

      localStorage.setItem('notificationPermission', 'denied')

      console.log('❌ Уведомления отклонены')
    }
  }

  useEffect(() => {
    const storedPermission = localStorage.getItem('notificationPermission')

    if (storedPermission) {
      setPermission(storedPermission as NotificationPermission)
    } else {
      setPermission(Notification.permission)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      {permission && (
        <>
          <label className={styles.title}>Notifications</label>
          <CustomSwitch
            isChecked={permission === 'granted'}
            onChange={(_name, value) =>
              handleSwitchChange(value as boolean)
            }
          />
        </>
      )}
    </div>
  )
}
