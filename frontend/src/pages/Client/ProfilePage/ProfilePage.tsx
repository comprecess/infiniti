import { useCallback, useEffect, useState } from 'react'

import { UserInfo } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { ProfileChangeInfoCard } from '../../../widgets/ProfileChangeInfoCard/ProfileChangeInfoCard'
import styles from './ProfilePage.module.scss'

export const ClientProfilePage = () => {
  const [profileData, setProfileData] = useState<UserInfo>()

  const getProfileData = useCallback(async () => {
    const response = await getProfileInfo()

    if (!response.status) return

    setProfileData(response.data)
  }, [])

  const updatedProfileInfo = () => {
    getProfileData()
  }

  useEffect(() => {
    getProfileData()
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Profile'
  }, [])

  return (
    <div className={styles.wrapper}>
      {profileData ? (
        <div className={styles.section}>
          <div className={styles.listItems}>
            <ProfileCard
              talent={profileData}
              onChangeInfo={updatedProfileInfo}
            />
            <ProfileChangeInfoCard
              talent={profileData}
              onChangeInfo={updatedProfileInfo}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
