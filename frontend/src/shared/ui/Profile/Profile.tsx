import { FC } from 'react'

import { profileInfoString } from '../../../app/constants/constants'
import { getSession } from '../../utils/Saving/Session/GetSession'
import styles from './Profile.module.scss'

export const Profile: FC = () => {
  const profileData = getSession(profileInfoString)

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
