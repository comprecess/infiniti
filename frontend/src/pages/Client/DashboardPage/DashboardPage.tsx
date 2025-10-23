import { useCallback, useEffect, useState } from 'react'

import styles from './DashboardPage.module.scss'
import {
  AccountingTransactionsData,
  ClientOfferData,
  DashboardRecentInvoicesData,
  OrdersViewCompany,
  UserInfo,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { AddFundModal } from '../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AddFundModal/AddFundModal'
import { BigCard } from '../../../features/Admin/DashboardPage/CashFlow/BigCard/BigCard'
import { BarChart } from '../../../features/Admin/DashboardPage/CashFlow/Chart/DashboardChart/BarChart'
import { RecentInvoices } from '../../../features/Client/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentOffers } from '../../../features/Client/DashboardPage/RecentOffers/RecentOffers'
import { RecentOrders } from '../../../features/Client/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Client/DashboardPage/RecentTransactions/RecentTransactions'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDashboardInfo } from '../../../shared/utils/api/Client/Dashboard/get-dashboard-info'
import { postAddFund } from '../../../shared/utils/api/Client/Dashboard/post-add-fund'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { UserCard } from '../../../widgets/UserCard/UserCard'

export const ClientDashboardPage = () => {
  const [data, setData] = useState<{
    transaction: AccountingTransactionsData[]
    invoice: DashboardRecentInvoicesData[]
    offer: ClientOfferData[]
    order: OrdersViewCompany[]
  } | null>(null)
  const [profileData, setProfileData] = useState<UserInfo | null>(null)

  const [isAddFund, setIsAddFund] = useState<boolean>(false)

  const handleOpenCloseAddFund = () => {
    setIsAddFund(prev => !prev)
  }

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

  const addFund = async (_name: string, value: string) => {
    const response = await postAddFund(value)

    if (!response.status) return

    const url = `/${Routes.public}/${Routes.invoice}/${Routes.view}/${response.data.public}`

    window.open(url, '_blank')
  }

  useEffect(() => {
    getDashboardData()
    getProfileData()

    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        {profileData && data ? (
          <>
            <section className={styles.sectionFirst}>
              <UserCard profileData={profileData} handleOpenCloseAddFund={handleOpenCloseAddFund} />
              <div className={styles.recentRightCard}>
                <div className={styles.cardsContent}>
                  <div className={styles.cards}>
                    <BigCard
                      title='Income'
                      icon='/icons/user.svg'
                      amount='15'
                      style={styles.bigCard}
                      onClick={() => {}}
                    />
                    <BigCard
                      title='Projects'
                      icon='/icons/elements.svg'
                      amount='8'
                      style={styles.bigCard}
                      onClick={() => {}}
                    />
                    <BigCard
                      title='Invoices'
                      icon='/icons/userPlusPurple.svg'
                      amount='10'
                      style={styles.bigCard}
                      onClick={() => {}}
                    />
                    <BigCard
                      title='Offers'
                      icon='/icons/user.svg'
                      amount='13'
                      style={styles.bigCard}
                      onClick={() => {}}
                    />
                  </div>
                </div>
                <RecentCard title='Chart' style={styles.chartWrapper}>
                  <div className={styles.chart}>
                    <BarChart
                      data={{
                        'Oct 2025': { Income: 327, Expense: 812 },
                        'Nov 2025': { Income: 915, Expense: 432 },
                        'Dec 2025': { Income: 158, Expense: 974 },
                        'Jan 2025': { Income: 604, Expense: 289 },
                        'Feb 2025': { Income: 217, Expense: 643 },
                        'Mar 2025': { Income: 789, Expense: 455 },
                        'Apr 2025': { Income: 482, Expense: 1103 },
                        'May 2025': { Income: 1015, Expense: 302 },
                        'Jun 2025': { Income: 366, Expense: 588 },
                        'Jul 2025': { Income: 742, Expense: 955 },
                        'Aug 2025': { Income: 529, Expense: 437 },
                        'Sep 2025': { Income: 892, Expense: 1201 },
                      }}
                    />
                    {' '}
                  </div>
                  {' '}
                </RecentCard>
              </div>
            </section>
            <section className={styles.section}>
              <RecentCard title='Recent Orders' style={styles.recentFullScreen}>
                <RecentOrders orders={data.order} />
              </RecentCard>
            </section>
            <section className={styles.section}>
              <RecentCard title='Recent Transactions' style={styles.recentFullScreen}>
                <RecentTransactions transactions={data.transaction} />
              </RecentCard>
            </section>
            <section className={styles.section}>
              <RecentCard title='Recent Invoices' style={styles.recentFullScreen}>
                <RecentInvoices invoices={data.invoice} />
              </RecentCard>
            </section>
            <section className={styles.section}>
              <RecentCard title='Recent Offers' style={styles.recentFullScreen}>
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
      {isAddFund && (
        <AddFundModal
          isAdmin={false}
          title='Add Fund'
          name='addAmount'
          buttonTitle='Add'
          modalAddFund={isAddFund}
          handleOpenCloseModal={handleOpenCloseAddFund}
          onSendValue={addFund}
        />
      )}
    </>
  )
}
