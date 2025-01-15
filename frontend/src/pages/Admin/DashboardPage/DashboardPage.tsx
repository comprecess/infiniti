import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DashboardData,
  RolesAccess,
} from '../../../app/constants/constants'
import { Calendar } from '../../../features/Admin/DashboardPage/Calendar/Calendar'
import { CashFlow } from '../../../features/Admin/DashboardPage/CashFlow/CashFlow'
import { ExpensesCategory } from '../../../features/Admin/DashboardPage/ExpensesCategory/ExpensesCategory'
import { IncomeExpenseMonthly } from '../../../features/Admin/DashboardPage/IncomeExpenseMonthly/IncomeExpenseMonthly'
import { LatestExpense } from '../../../features/Admin/DashboardPage/LatestExpense/LatestExpense'
import { LatestIncome } from '../../../features/Admin/DashboardPage/LatestIncome/LatestIncome'
import { NetWorthAccountBalances } from '../../../features/Admin/DashboardPage/NetWorthAccountBalances/NetWorthAccountBalances'
import { RecentClients } from '../../../features/Admin/DashboardPage/RecentClients/RecentClients'
import { RecentInvoices } from '../../../features/Admin/DashboardPage/RecentInvoices/RecentInvoices'
import { RecentProjects } from '../../../features/Admin/DashboardPage/RecentProjects/RecentProjects'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCashFlowInfo } from '../../../shared/utils/api/Admin/Dashboard/GetCashFlowInfo'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './DashboardPage.module.scss'

export const AdminDashboardPage: FC = () => {
  const [dataCashFlow, setDataCashFlow] = useState<DashboardData | null>(
    null,
  )

  const { t } = useTranslation()

  const getCashFlowData = async () => {
    const getResponse: {
      access: RolesAccess
      cashFlow: DashboardData
      status: boolean
    } = await getCashFlowInfo()

    setDataCashFlow(getResponse.cashFlow)
  }

  useEffect(() => {
    getCashFlowData()

    window.scrollTo(0, 0)
    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        {dataCashFlow ? (
          <RecentCard
            refreshIcon
            title={t('admin-dashboard-page-card-1-title')}
            style={`${styles.recentFullScreen} ${styles.zIndex}`}
          >
            <CashFlow data={dataCashFlow} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <section className={styles.sectionSecond}>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-2-title')}
          style={styles.recentHalf}
        >
          <RecentClients />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-3-title')}
          style={styles.recentHalf}
        >
          <RecentProjects />
        </RecentCard>
      </section>
      <section className={styles.sectionThird}>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-4-title')}
          style={styles.recentHalf}
        >
          <RecentInvoices />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-5-title')}
          style={styles.recentHalf}
        >
          <Calendar />
        </RecentCard>
      </section>
      <section className={styles.sectionFourth}>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-6-title')}
          style={styles.recentHalf}
        >
          <LatestIncome />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-7-title')}
          style={styles.recentHalf}
        >
          <LatestExpense />
        </RecentCard>
      </section>
      <section className={styles.sectionFifth}>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-8-title')}
          style={styles.recentHalf}
        >
          <NetWorthAccountBalances />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-9-title')}
          style={styles.recentHalf}
        >
          <ExpensesCategory />
        </RecentCard>
      </section>
      <section className={styles.sectionSixth}>
        <RecentCard
          ordinaryIcons
          title={t('admin-dashboard-page-card-10-title')}
          style={styles.recentFullScreen}
        >
          <IncomeExpenseMonthly />
        </RecentCard>
      </section>
    </div>
  )
}
