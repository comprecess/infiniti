import styles from './Header.module.scss'
import { TalentsLevel } from '../../../shared/ui/TalentsLevel/TalentsLevel'

interface HeaderProps {
  avatar: string
  name: string
  specialization: string
  location: string
  level: string
}

export const Header = ({
  avatar,
  name,
  specialization,
  location,
  level,
}: HeaderProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <img
          src={avatar}
          alt='Avatar'
          style={{ width: '56px', height: '56px' }}
        />
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
