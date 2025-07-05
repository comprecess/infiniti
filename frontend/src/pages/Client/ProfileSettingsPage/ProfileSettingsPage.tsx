import { useEffect, useState } from 'react'

import { NotificationCardData } from '../../../app/constants/constants'
import { ProfileSettings } from '../../../features/General/ProfileSettings/ProfileSettings'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPushList } from '../../../shared/utils/api/Push/GetPushList'
import { postPushUnsubscribed } from '../../../shared/utils/api/Push/PostPushUnsubscribed'
import styles from './ProfileSettingsPage.module.scss'

export const ClientProfileSettingsPage = () => {
  const [listNotifications, setListNotifications] = useState<
    NotificationCardData[] | null
  >(null)

  const showToast = useCustomToast()

  const getProfilePushList = async () => {
    const response = await getPushList()

    setListNotifications(response.data)
  }

  const handleDeleteNotifications = async (token: string) => {
    const response = await postPushUnsubscribed(token)

    if (response.status) {
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
