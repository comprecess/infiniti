import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import {
  BarChart,
  DataJson,
} from '../../../features/Admin/DashboardPage/CashFlow/Chart/DashboardChart/BarChart'
import { RecentInvoices } from '../../../features/Client/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentOffers } from '../../../features/Client/DashboardPage/RecentOffers/RecentOffers'
import { RecentOrders } from '../../../features/Client/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Client/DashboardPage/RecentTransactions/RecentTransactions'
import { ChartLegend } from '../../../shared/ui/ChartLegend/ChartLegend'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Scrollable } from '../../../shared/ui/Scrollable/Scrollable'
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
    quantity: {
      businessModel: number
      project: number
      talent: number
    }
    graph: DataJson
  } | null>(null)
  const [profileData, setProfileData] = useState<UserInfo | null>(null)

  const [isAddFund, setIsAddFund] = useState<boolean>(false)

  const navigate = useNavigate()

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
                <Scrollable>
                  <div className={styles.cards}>
                    <BigCard
                      title='Talents'
                      icon='/icons/user.svg'
                      amount={data.quantity.talent.toString()}
                      style={styles.bigCard}
                      onClick={() => navigate(`/${Routes.clientPages}/${Routes.talents}`)}
                    />
                    <BigCard
                      title='Projects'
                      icon='/icons/elements.svg'
                      amount={data.quantity.project.toString()}
                      style={styles.bigCard}
                      onClick={() => navigate(`/${Routes.clientPages}/${Routes.projects}`)}
                    />
                    <BigCard
                      title='Business Models'
                      icon='/icons/userPlusPurple.svg'
                      amount={data.quantity.businessModel.toString()}
                      style={styles.bigCard}
                      onClick={() =>
                        navigate(
                          `/${Routes.clientPages}/${Routes.businessPlan}/${Routes.businessModels}`,
                        )
                      }
                    />
                  </div>
                </Scrollable>
                <RecentCard title='Paid/Unpaid Invoices'>
                  <Scrollable>
                    <div className={styles.chart}>
                      <div className={styles.legends}>
                        <ChartLegend title='Paid' color={styles.paidColor} />
                        <ChartLegend title='Unpaid' color={styles.unpaidColor} />
                      </div>
                      <BarChart
                        data={data.graph}
                        namesKeys={[
                          'admin-dashboard-page-bar-chart-legend-3',
                          'admin-dashboard-page-bar-chart-legend-4',
                        ]}
                      />
                    </div>
                  </Scrollable>
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
