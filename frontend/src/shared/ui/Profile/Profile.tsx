import { FC, useCallback, useEffect, useState } from 'react'

import {
  profileInfoString,
  UserInfo,
} from '../../../app/constants/constants'
import { getSession } from '../../utils/Saving/Session/GetSession'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import styles from './Profile.module.scss'

export const Profile: FC = () => {
  const [profileData, setProfileData] = useState<UserInfo>()

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
        <>
          <span className={styles.name}>{profileData.account}</span>
          <img
            className={styles.avatar}
            alt='Profile Avatar'
            src={
              profileData.img
                ? profileData.img
                : '/profileWithoutAvatar.svg'
            }
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}
