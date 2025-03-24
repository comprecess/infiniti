import { useEffect } from 'react'

import { RecentInvoices } from '../../../features/Client/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentOffers } from '../../../features/Client/DashboardPage/RecentOffers/RecentOffers'
import { RecentOrders } from '../../../features/Client/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Client/DashboardPage/RecentTransactions/RecentTransactions'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { UserCard } from '../../../widgets/UserCard/UserCard'
import styles from './DashboardPage.module.scss'

export const ClientDashboardPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <UserCard />
        <RecentCard title='Recent Orders' style={styles.recentOrders}>
          <RecentOrders />
        </RecentCard>
      </section>
      <section className={styles.sectionSecond}>
        <RecentCard
          title='Recent Transactions'
          style={styles.recentFullScreen}
        >
          <RecentTransactions />
        </RecentCard>
      </section>
      <section className={styles.sectionThird}>
        <RecentCard
          title='Recent Invoices'
          style={styles.recentFullScreen}
        >
          <RecentInvoices />
        </RecentCard>
      </section>
      <section className={styles.sectionFourth}>
        <RecentCard title='Recent Offers' style={styles.recentFullScreen}>
          <RecentOffers />
        </RecentCard>
      </section>
    </div>
  )
}
