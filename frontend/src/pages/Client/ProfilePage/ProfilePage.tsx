import { FC, useEffect } from 'react'

import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { ProfileChangeInfoCard } from '../../../widgets/ProfileChangeInfoCard/ProfileChangeInfoCard'
import styles from './ProfilePage.module.scss'

export const ClientProfilePage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Profile'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.listItems}>
          <ProfileCard />
          <ProfileChangeInfoCard />
        </div>
      </div>
    </div>
  )
}
