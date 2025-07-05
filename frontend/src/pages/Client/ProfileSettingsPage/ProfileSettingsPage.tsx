import { useEffect, useState } from 'react'

import { NotificationCardData } from '../../../app/constants/constants'
import { ProfileSettings } from '../../../features/General/ProfileSettings/ProfileSettings'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPushList } from '../../../shared/utils/api/Push/GetPushList'
import styles from './ProfileSettingsPage.module.scss'

export const ClientProfileSettingsPage = () => {
  const [listNotifications, setListNotifications] = useState<
  NotificationCardData[] | null
  >(null)

  const getProfilePushList = async () => {
    const response = await getPushList()

    setListNotifications(response.data)
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
          <ProfileSettings listNotifications={listNotifications} />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
