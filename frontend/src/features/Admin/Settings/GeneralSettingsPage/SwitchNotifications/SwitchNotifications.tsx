import { useEffect, useState } from 'react'

import {
  handleNotifications,
  initOneSignal,
} from '../../../../../initOneSignal'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import styles from './SwitchNotifications.module.scss'

export const SwitchNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission | null>(null)

  const showToast = useCustomToast()

  const handleSwitchChange = async (isEnabled: boolean) => {
    const newPermission = await handleNotifications(isEnabled)
    setPermission(newPermission)

    showToast({
      title: isEnabled ? 'Уведомления включены' : 'Уведомления отключены',
      description: isEnabled
        ? 'You have successfully enabled notifications'
        : 'You have successfully disabled notifications',
      status: 'success',
    })
  }

  useEffect(() => {
    const checkPermission = async () => {
      const stored = localStorage.getItem(
        'notificationPermission',
      ) as NotificationPermission | null

      if (stored) {
        setPermission(stored)
      } else {
        const nativePermission = Notification.permission

        // Проверим, активна ли подписка
        await initOneSignal()
        window.OneSignal.push(() => {
          window.OneSignal.isPushNotificationsEnabled().then(
            (enabled: boolean) => {
              setPermission(enabled ? 'granted' : nativePermission)
              localStorage.setItem(
                'notificationPermission',
                enabled ? 'granted' : nativePermission,
              )
            },
          )
        })
      }
    }

    checkPermission()
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
