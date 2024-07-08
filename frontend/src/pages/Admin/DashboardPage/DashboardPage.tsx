import { FC, useEffect } from 'react'

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
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './DashboardPage.module.scss'

export const AdminDashboardPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Dashboard'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <RecentCard
          refreshIcon
          title='Cash Flow'
          style={styles.recentFullScreen}
        >
          <CashFlow />
        </RecentCard>
      </section>
      <section className={styles.sectionSecond}>
        <RecentCard
          ordinaryIcons
          title='Recent Clients'
          style={styles.recentHalf}
        >
          <RecentClients />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title='Recent Projects'
          style={styles.recentHalf}
        >
          <RecentProjects />
        </RecentCard>
      </section>
      <section className={styles.sectionThird}>
        <RecentCard
          ordinaryIcons
          title='Recent Invoices'
          style={styles.recentHalf}
        >
          <RecentInvoices />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title='Calendar'
          style={styles.recentHalf}
        >
          <Calendar />
        </RecentCard>
      </section>
      <section className={styles.sectionFourth}>
        <RecentCard
          ordinaryIcons
          title='Latest Income'
          style={styles.recentHalf}
        >
          <LatestIncome />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title='Latest Expense'
          style={styles.recentHalf}
        >
          <LatestExpense />
        </RecentCard>
      </section>
      <section className={styles.sectionFifth}>
        <RecentCard
          ordinaryIcons
          title='Net Worth & Account Balances'
          style={styles.recentHalf}
        >
          <NetWorthAccountBalances />
        </RecentCard>
        <RecentCard
          ordinaryIcons
          title='Expenses by Category'
          style={styles.recentHalf}
        >
          <ExpensesCategory />
        </RecentCard>
      </section>
      <section className={styles.sectionSixth}>
        <RecentCard
          ordinaryIcons
          title='Income vs Expense: Monthly'
          style={styles.recentFullScreen}
        >
          <IncomeExpenseMonthly />
        </RecentCard>
      </section>
    </div>
  )
}
