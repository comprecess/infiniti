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
        <RecentCard title='Cash Flow' style={styles.recentFullScreen}>
          <CashFlow />
        </RecentCard>
      </div>
      <div className={styles.sectionSecond}>
        <RecentCard title='Recent Clients' style={styles.recentHalf}>
          <RecentClients />
        </RecentCard>
        <RecentCard title='Recent Projects' style={styles.recentHalf}>
          <RecentProjects />
        </RecentCard>
      </div>
      <div className={styles.sectionThird}>
        <RecentCard title='Recent Invoices' style={styles.recentHalf}>
          <RecentInvoices />
        </RecentCard>
        <RecentCard title='Calendar' style={styles.recentHalf}>
          <Calendar />
        </RecentCard>
      </div>
      <div className={styles.sectionFourth}>
        <RecentCard title='Latest Income' style={styles.recentHalf}>
          <LatestIncome />
        </RecentCard>
        <RecentCard title='Latest Expense' style={styles.recentHalf}>
          <LatestExpense />
        </RecentCard>
      </div>
      <div className={styles.sectionFifth}>
        <RecentCard
          title='Net Worth & Account Balances'
          style={styles.recentHalf}
        >
          <NetWorthAccountBalances />
        </RecentCard>
        <RecentCard title='Expenses by Category' style={styles.recentHalf}>
          <ExpensesCategory />
        </RecentCard>
      </div>
      <div className={styles.sectionSixth}>
        <RecentCard
          title='Income vs Expense: Monthly'
          style={styles.recentHalf}
        >
          <IncomeExpenseMonthly />
        </RecentCard>
        <RecentCard title='Expenses by Category' style={styles.recentHalf}>
          <ExpensesCategory />
        </RecentCard>
      </div>
    </div>
  )
}
