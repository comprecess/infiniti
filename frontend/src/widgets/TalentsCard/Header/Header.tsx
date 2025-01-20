import { FC } from 'react'

import { TalentsLevel } from '../../../shared/ui/TalentsLevel/TalentsLevel'
import styles from './Header.module.scss'

interface HeaderProps {
  avatar: string
  name: string
  specialization: string
  location: string
  level: string
}

export const Header: FC<HeaderProps> = ({
  avatar,
  name,
  specialization,
  location,
  level,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <img src={avatar} alt='Profile Avatar' />
      </div>
      <div className={styles.texts}>
        <h5 className={styles.name}>{name}</h5>
        <div className={styles.description}>
          <span className={styles.specialization}>{specialization}</span>
          <div className={styles.containerEllipse}>
            <div className={styles.ellipse} />
          </div>
          <span className={styles.location}>{location}</span>
        </div>
      </div>
      <div className={styles.level}>
        <TalentsLevel title={level} />
      </div>
    </div>
  )
}
