import { useEffect, useState } from 'react'

import styles from './ProfileSettingsPage.module.scss'
import { NotificationCardData } from '../../../app/constants/constants'
import { ProfileSettings } from '../../../features/General/ProfileSettings/ProfileSettings'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getListPush } from '../../../shared/utils/api/Push/get-list-push'
import { patchSetDevicePush } from '../../../shared/utils/api/Push/patch-set-device-push'
import { postUnsubPush } from '../../../shared/utils/api/Push/post-unsub-push'

export const AdminProfileSettingsPage = () => {
  const [listNotifications, setListNotifications] = useState<
  NotificationCardData[] | null
  >(null)

  const showToast = useCustomToast()

  const getProfilePushList = async () => {
    const response = await getListPush()

    if (!response.status) return

    setListNotifications(response.data.data)
  }

  const handleDeleteNotifications = async (token: string) => {
    const resUserSettings = await patchSetDevicePush(token, 0)
    const resUnsubscribed = await postUnsubPush(token)

    if (resUnsubscribed.status && resUserSettings.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed this device',
        status: 'success',
      })

      getProfilePushList()
    }
  }

  useEffect(() => {
    getProfilePushList()
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Profile Settings'
  }, [])

  return (
    <div className={styles.wrapper}>
      {listNotifications ? (
        <div className={styles.section}>
          <ProfileSettings
            listNotifications={listNotifications}
            deleteNotification={handleDeleteNotifications}
          />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
