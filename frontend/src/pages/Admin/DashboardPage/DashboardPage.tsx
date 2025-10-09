import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'

import styles from './DashboardPage.module.scss'
import {
  DashboardData,
  DashboardInvoicesStatusesData,
  DashboardLatestIncomeExpenseData,
  DashboardNetWorthData,
  DashboardRecentClientData,
  DashboardRecentInvoicesData,
  DashboardRecentProjectsData,
  RolesAccess,
} from '../../../app/constants/constants'
import { CashFlow } from '../../../features/Admin/DashboardPage/CashFlow/CashFlow'
import { LatestExpense } from '../../../features/Admin/DashboardPage/LatestExpense/LatestExpense'
import { LatestIncome } from '../../../features/Admin/DashboardPage/LatestIncome/LatestIncome'
import { NetWorthAccountBalances } from '../../../features/Admin/DashboardPage/NetWorthAccountBalances/NetWorthAccountBalances'
import { RecentClients } from '../../../features/Admin/DashboardPage/RecentClients/RecentClients'
import { RecentInvoices } from '../../../features/Admin/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentProjects } from '../../../features/Admin/DashboardPage/RecentProjects/RecentProjects'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCashFlowInfo } from '../../../shared/utils/api/Admin/Dashboard/get-cash-flow-info'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const AdminDashboardPage = () => {
  const { roles } = useOutletContext<{
    roles?: { [key: string]: RolesAccess }
  }>()

  const { t } = useTranslation()

  const { data: dataDashboard } = useQuery({
    queryKey: ['dashboard-full-info'],
    queryFn: async () => {
      const response = await getCashFlowInfo()

      if (!response.status) return

      return response.data as {
        access: RolesAccess
        account: DashboardNetWorthData
        cashFlow: DashboardData
        recentClients: DashboardRecentClientData[]
        recentProjects: DashboardRecentProjectsData[]
        invoices: DashboardRecentInvoicesData[]
        invoiceStatus: DashboardInvoicesStatusesData
        latestIncome: DashboardLatestIncomeExpenseData[]
        latestExpense: DashboardLatestIncomeExpenseData[]
        status: boolean
      }
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <>
      {dataDashboard ? (
        <div className={styles.wrapper}>
          <section className={styles.sectionFirst}>
            <RecentCard
              refreshIcon
              title={t('admin-dashboard-page-card-1-title')}
              style={`${styles.recentFullScreen} ${styles.zIndex}`}
            >
              <CashFlow data={dataDashboard.cashFlow} roles={roles} />
            </RecentCard>
          </section>
          <section className={styles.sectionSecond}>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-2-title')}
              style={styles.recentHalf}
            >
              <RecentClients recentClients={dataDashboard.recentClients} roles={roles} />
            </RecentCard>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-3-title')}
              style={styles.recentHalf}
            >
              <RecentProjects recentProjects={dataDashboard.recentProjects} roles={roles} />
            </RecentCard>
          </section>
          <section className={styles.sectionThird}>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-4-title')}
              style={styles.recentHalf}
            >
              <RecentInvoices
                invoices={dataDashboard.invoices}
                statuses={dataDashboard.invoiceStatus}
                roles={roles}
              />
            </RecentCard>
            {/* <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-5-title')}
              style={styles.recentHalf}
            >
              <Calendar />
            </RecentCard> */}
          </section>
          <section className={styles.sectionFourth}>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-6-title')}
              style={styles.recentHalf}
            >
              <LatestIncome latestIncome={dataDashboard.latestIncome} />
            </RecentCard>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-7-title')}
              style={styles.recentHalf}
            >
              <LatestExpense latestExpense={dataDashboard.latestExpense} />
            </RecentCard>
          </section>
          <section className={styles.sectionFifth}>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-8-title')}
              style={styles.recentHalf}
            >
              <NetWorthAccountBalances account={dataDashboard.account} />
            </RecentCard>
            {/* <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-9-title')}
              style={styles.recentHalf}
            >
              <ExpensesCategory />
            </RecentCard> */}
          </section>
          {/* <section className={styles.sectionSixth}>
            <RecentCard
              ordinaryIcons
              title={t('admin-dashboard-page-card-10-title')}
              style={styles.recentFullScreen}
            >
              <IncomeExpenseMonthly />
            </RecentCard>
          </section> */}
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </>
  )
}
