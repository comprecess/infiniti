import { FC } from 'react'

import { ProfileInfo } from '../../../../../app/data/general/profile'
import styles from './Avatar.module.scss'

export const Avatar: FC = () => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.avatar} src={ProfileInfo.avatar} alt='Avatar' />
      <span className={styles.title}>{ProfileInfo.name}</span>
    </div>
  )
}
