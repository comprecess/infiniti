import { useCallback, useEffect, useState } from 'react'

import styles from './ProfilePage.module.scss'
import { UserInfo } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { ProfileChangeInfoCard } from '../../../widgets/ProfileChangeInfoCard/ProfileChangeInfoCard'

export const ClientProfilePage = () => {
  const [profileData, setProfileData] = useState<UserInfo>()

  const getProfileData = useCallback(async () => {
    const response = await getProfileInfo()

    if (!response.status) return

    setProfileData(response.data)
  }, [])

  useEffect(() => {
    getProfileData()

    document.title = 'infiniti | Profile'
  }, [])

  return (
    <div className={styles.wrapper}>
      {profileData ? (
        <div className={styles.section}>
          <div className={styles.listItems}>
            <ProfileCard
              talent={profileData}
              onChangeInfo={getProfileData}
            />
            <ProfileChangeInfoCard
              talent={profileData}
              onChangeInfo={getProfileData}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
