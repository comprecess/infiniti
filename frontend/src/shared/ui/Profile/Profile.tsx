import { FC, useCallback, useEffect, useState } from 'react'

import {
  AdminInfo,
  profileInfoString,
  UserInfo,
} from '../../../app/constants/constants'
import { getSession } from '../../utils/Saving/Session/GetSession'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import styles from './Profile.module.scss'

interface ProfileProps {
  isAdmin?: boolean
}

type ProfileData = UserInfo | AdminInfo

export const Profile: FC<ProfileProps> = ({ isAdmin }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  const fetchProfileData = useCallback(() => {
    const profileData = getSession(profileInfoString) as ProfileData
    if (isAdmin) {
      setProfileData(profileData as AdminInfo)
    } else {
      setProfileData(profileData as UserInfo)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  return (
    <div className={styles.wrapper}>
      {profileData ? (
        <>
          <span className={styles.name}>
            {profileData.account ? profileData.account : '-'}
          </span>
          <img
            className={styles.avatar}
            alt='Profile Avatar'
            src={profileData.img || '/profileWithoutAvatar.svg'}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}
