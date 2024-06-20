import { FC, useCallback, useEffect, useState } from 'react'

import {
  profileInfoString,
  UserInfo,
} from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSession } from '../../../shared/utils/Saving/Session/GetSession'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { ProfileChangeInfoCard } from '../../../widgets/ProfileChangeInfoCard/ProfileChangeInfoCard'
import styles from './ProfilePage.module.scss'

export const ClientProfilePage: FC = () => {
  const [profileData, setProfileData] = useState<UserInfo>()

  useEffect(() => {
    document.title = 'infiniti | Profile'
  }, [])

  const getProfileData = useCallback(async () => {
    const profileData = getSession(profileInfoString) as UserInfo

    setProfileData(profileData)
  }, [])

  useEffect(() => {
    getProfileData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {profileData ? (
        <div className={styles.section}>
          <div className={styles.listItems}>
            <ProfileCard talent={profileData} />
            <ProfileChangeInfoCard talent={profileData} />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
