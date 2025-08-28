import { useCallback, useEffect, useState } from 'react'

import {
  AccountingTransactionsData,
  ClientOfferData,
  DashboardRecentInvoicesData,
  OrdersViewCompany,
  UserInfo,
} from '../../../app/constants/constants'
import { RecentInvoices } from '../../../features/Client/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentOffers } from '../../../features/Client/DashboardPage/RecentOffers/RecentOffers'
import { RecentOrders } from '../../../features/Client/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Client/DashboardPage/RecentTransactions/RecentTransactions'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDashboardInfo } from '../../../shared/utils/api/Client/Dashboard/get-dashboard-info'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { UserCard } from '../../../widgets/UserCard/UserCard'
import styles from './DashboardPage.module.scss'

export const ClientDashboardPage = () => {
  const [data, setData] = useState<{
    transaction: AccountingTransactionsData[]
    invoice: DashboardRecentInvoicesData[]
    offer: ClientOfferData[]
    order: OrdersViewCompany[]
  } | null>(null)
  const [profileData, setProfileData] = useState<UserInfo | null>(null)

  const getDashboardData = useCallback(async () => {
    const response = await getDashboardInfo()

    if (!response.status) return

    setData(response.data)
  }, [])

  const getProfileData = useCallback(async () => {
    const response = await getProfileInfo()

    if (!response.status) return

    setProfileData(response.data)
  }, [])

  useEffect(() => {
    getDashboardData()
    getProfileData()

    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <div className={styles.wrapper}>
      {profileData && data ? (
        <>
          <section className={styles.sectionFirst}>
            <UserCard profileData={profileData} />
            <RecentCard title='Recent Orders' style={styles.recentOrders}>
              <RecentOrders orders={data.order} />
            </RecentCard>
          </section>
          <section className={styles.sectionSecond}>
            <RecentCard
              title='Recent Transactions'
              style={styles.recentFullScreen}
            >
              <RecentTransactions transactions={data.transaction} />
            </RecentCard>
          </section>
          <section className={styles.sectionThird}>
            <RecentCard
              title='Recent Invoices'
              style={styles.recentFullScreen}
            >
              <RecentInvoices invoices={data.invoice} />
            </RecentCard>
          </section>
          <section className={styles.sectionFourth}>
            <RecentCard
              title='Recent Offers'
              style={styles.recentFullScreen}
            >
              <RecentOffers offers={data.offer} />
            </RecentCard>
          </section>
        </>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
