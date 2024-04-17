import { FC } from 'react'

import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import styles from './DashboardPage.module.scss'

export const DashboardPage: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionOne}>
        <ProfileCard />
        <p>RecentOrders</p>
      </div>
    </div>
  )
}
