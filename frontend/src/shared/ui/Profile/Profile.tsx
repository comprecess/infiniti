import { FC } from 'react'

import {
  ProfileInfo,
  profileInfoString,
} from '../../../app/constants/constants'
import { getSession } from '../../utils/Saving/Session/GetSession'
import styles from './Profile.module.scss'

export const Profile: FC = () => {
  const profileData = getSession(profileInfoString) as ProfileInfo

  return (
    <div className={styles.wrapper}>
      <span className={styles.name}>{profileData.account}</span>
      <img
        className={styles.avatar}
        alt='Profile Avatar'
        src={
          profileData.img ? profileData.img : '/profileWithoutAvatar.svg'
        }
      />
    </div>
  )
}
