import { useEffect, useState } from 'react'

import { handleNotifications } from '../../../../../initOneSignal'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import styles from './SwitchNotifications.module.scss'

export const SwitchNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission | null>(null)

  const showToast = useCustomToast()

  const handleSwitchChange = async (isEnabled: boolean) => {
    if (isEnabled) {
      await handleNotifications(true)

      showToast({
        title: 'Уведомления включены',
        description: 'Вы успешно включили уведомления',
        status: 'success',
      })
    } else {
      await handleNotifications(false)

      showToast({
        title: 'Уведомления отключены',
        description: 'Вы успешно отключили уведомления',
        status: 'success',
      })
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
