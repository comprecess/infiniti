import { FC } from 'react'

import { RecentOrders } from '../../../features/Dashboard/RecentOrders/RecentOrders'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './DashboardPage.module.scss'

export const DashboardPage: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionOne}>
        <ProfileCard />
        <RecentCard title='Recent Orders'>
          <RecentOrders />
        </RecentCard>
      </div>
    </div>
  )
}
