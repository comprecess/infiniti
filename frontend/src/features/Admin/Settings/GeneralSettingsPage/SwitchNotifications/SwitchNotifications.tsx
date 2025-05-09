import { useEffect, useState } from 'react'

import {
  getNotificationStatus,
  handleNotifications,
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
    const checkStatus = async () => {
      const maxRetries = 3
      let attempts = 0

      while (attempts < maxRetries) {
        try {
          const permission = await getNotificationStatus()
          setPermission(permission)

          return
        } catch (error) {
          attempts++
          console.error(`❌ Попытка ${attempts} не удалась:`, error)
          await new Promise(res => setTimeout(res, 1000))
        }
      }

      console.error(
        '❌ Не удалось получить статус уведомлений после 3 попыток',
      )
      setPermission('default')
    }

    checkStatus()
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
