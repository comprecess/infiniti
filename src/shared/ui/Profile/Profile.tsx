import { FC } from 'react'

import { ProfileInfo } from '../../../app/data/profile'
import styles from './Profile.module.scss'

export const Profile: FC = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.name}>{ProfileInfo.name}</span>
      <img
        className={styles.avatar}
        src={ProfileInfo.avatar}
        alt='Profile'
      />
    </div>
  )
}
