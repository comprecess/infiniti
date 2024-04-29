import { FC } from 'react'

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
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionFirst}>
        <RecentCard
          rightIcons
          updateIcon
          title='Cash Flow'
          style={styles.recentFullScreen}
        >
          <CashFlow />
        </RecentCard>
      </div>
      <div className={styles.sectionSecond}>
        <RecentCard rightIcons title='Recent Clients' style={styles.recentHalf}>
          <RecentClients />
        </RecentCard>
        <RecentCard
          rightIcons
          title='Recent Projects'
          style={styles.recentHalf}
        >
          <RecentProjects />
        </RecentCard>
      </div>
      <div className={styles.sectionThird}>
        <RecentCard
          rightIcons
          title='Recent Invoices'
          style={styles.recentHalf}
        >
          <RecentInvoices />
        </RecentCard>
        <RecentCard rightIcons title='Calendar' style={styles.recentHalf}>
          <Calendar />
        </RecentCard>
      </div>
      <div className={styles.sectionFourth}>
        <RecentCard rightIcons title='Latest Income' style={styles.recentHalf}>
          <LatestIncome />
        </RecentCard>
        <RecentCard rightIcons title='Latest Expense' style={styles.recentHalf}>
          <LatestExpense />
        </RecentCard>
      </div>
      <div className={styles.sectionFifth}>
        <RecentCard
          rightIcons
          title='Net Worth & Account Balances'
          style={styles.recentHalf}
        >
          <NetWorthAccountBalances />
        </RecentCard>
        <RecentCard
          rightIcons
          title='Expenses by Category'
          style={styles.recentHalf}
        >
          <ExpensesCategory />
        </RecentCard>
      </div>
      <div className={styles.sectionSixth}>
        <RecentCard
          rightIcons
          title='Income vs Expense: Monthly'
          style={styles.recentHalf}
        >
          <IncomeExpenseMonthly />
        </RecentCard>
        <RecentCard
          rightIcons
          title='Expenses by Category'
          style={styles.recentHalf}
        >
          <ExpensesCategory />
        </RecentCard>
      </div>
    </div>
  )
}
