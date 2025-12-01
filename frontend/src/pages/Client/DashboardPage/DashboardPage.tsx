/* eslint-disable max-len */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './DashboardPage.module.scss'
import {
  AccountingTransactionsData,
  ClientDocumentsData,
  ClientOfferData,
  DashboardRecentInvoicesData,
  OrdersViewCompany,
  UserInfo,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { AddFundModal } from '../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AddFundModal/AddFundModal'
import { BigCard } from '../../../features/Admin/DashboardPage/CashFlow/BigCard/BigCard'
import { NetWorth } from '../../../features/Admin/DashboardPage/CashFlow/Chart/NetWorth/NetWorth'
import { RecentDocuments } from '../../../features/Client/DashboardPage/RecentDocuments/RecentDocuments'
import { RecentInvoices } from '../../../features/Client/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentOffers } from '../../../features/Client/DashboardPage/RecentOffers/RecentOffers'
import { RecentOrders } from '../../../features/Client/DashboardPage/RecentOrders/RecentOrders'
import { RecentTransactions } from '../../../features/Client/DashboardPage/RecentTransactions/RecentTransactions'
import { BarChart, DataJson } from '../../../shared/ui/DashboardChart/BarChart'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Scrollable } from '../../../shared/ui/Scrollable/Scrollable'
import { getDashboardInfo } from '../../../shared/utils/api/Client/Dashboard/get-dashboard-info'
import { postAddFund } from '../../../shared/utils/api/Client/Dashboard/post-add-fund'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { UserCard } from '../../../widgets/UserCard/UserCard'

interface BaseDashboardData {
  transaction: AccountingTransactionsData[]
  invoice: DashboardRecentInvoicesData[]
  offer: ClientOfferData[]
  order: OrdersViewCompany[]
  graph: DataJson
  document: ClientDocumentsData[]
}

interface QuantityCustomer {
  businessModel: number
  businessPlan: number
  project: number
  talent: number
}

interface QuantitySupplier {
  tasksCount: number
  tasksCompletedCount: number
  hoursCount: number
  hoursWorkedCount: number
}

type CustomerDashboardData = BaseDashboardData & {
  isSupplier: false
  quantity: QuantityCustomer
}

type SupplierDashboardData = BaseDashboardData & {
  isSupplier: true
  quantity: QuantitySupplier
}

type DashboardData = CustomerDashboardData | SupplierDashboardData

export const ClientDashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null)
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
                    {!data.isSupplier && (
                      <>
                        <BigCard
                          title='Talents'
                          icon='/icons/user.svg'
                          amount={data.quantity.talent.toString()}
                          onClick={() =>
                            navigate(
                              `/${Routes.clientPages}/${Routes.talents}?page=1&sort%5Bname%5D=priceDay&sort%5Btype%5D=asc`,
                            )
                          }
                        />
                        <BigCard
                          title='Projects'
                          icon='/icons/elements.svg'
                          amount={data.quantity.project.toString()}
                          onClick={() => navigate(`/${Routes.clientPages}/${Routes.projects}`)}
                        />
                        <BigCard
                          title='Business Plans'
                          icon='/icons/userPlusPurple.svg'
                          amount={data.quantity.businessPlan.toString()}
                          onClick={() =>
                            navigate(
                              `/${Routes.clientPages}/${Routes.businessPlan}/${Routes.businessPlans}`,
                            )
                          }
                        />
                        <BigCard
                          title='Business Models'
                          icon='/icons/userPlusPurple.svg'
                          amount={data.quantity.businessModel.toString()}
                          onClick={() =>
                            navigate(
                              `/${Routes.clientPages}/${Routes.businessPlan}/${Routes.businessModels}?page=1`,
                            )
                          }
                        />
                      </>
                    )}
                    {data.isSupplier && (
                      <>
                        <BigCard
                          title='Total Tasks'
                          icon='/icons/user.svg'
                          amount={data.quantity.tasksCount.toString()}
                        />
                        <BigCard
                          title='Tasks Completed'
                          icon='/icons/elements.svg'
                          amount={data.quantity.tasksCompletedCount.toString()}
                        />
                        <BigCard
                          title='Total Hours'
                          icon='/icons/userPlusPurple.svg'
                          amount={data.quantity.hoursCount.toString()}
                        />
                        <BigCard
                          title='Hours Worked'
                          icon='/icons/userPlusPurple.svg'
                          amount={data.quantity.hoursWorkedCount.toString()}
                        />
                      </>
                    )}
                  </div>
                </Scrollable>
                <RecentCard title='Paid/Unpaid Invoices'>
                  <Scrollable>
                    <div className={styles.chart}>
                      <NetWorth
                        amount='-0-'
                        firstTitle='admin-dashboard-page-bar-chart-legend-4'
                        secondTitle='admin-dashboard-page-bar-chart-legend-3'
                      />
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
              <RecentCard title='Recent Documents' style={styles.recentFullScreen}>
                <RecentDocuments documents={data.document} />
              </RecentCard>
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
