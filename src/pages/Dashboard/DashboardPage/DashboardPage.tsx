import { FC } from 'react'

import { RecentOrders } from '../../../features/Dashboard/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Dashboard/DashboardPage/RecentTransactions/RecentTransactions'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './DashboardPage.module.scss'

export const DashboardPage: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionOne}>
        <ProfileCard />
        <RecentCard title='Recent Orders' style={styles.recentOrders}>
          <RecentOrders />
        </RecentCard>
      </div>
      <div className={styles.sectionTwo}>
        <RecentCard
          title='Recent Transactions'
          style={styles.recentFullScreen}
        >
          <RecentTransactions />
        </RecentCard>
      </div>
      <div className={styles.sectionThree}>
        <RecentCard
          title='Recent Invoices'
          style={styles.recentFullScreen}
        />
      </div>
      <div className={styles.sectionFour}>
        <RecentCard
          title='Recent Invoices'
          style={styles.recentFullScreen}
        />
      </div>
    </div>
  )
}
