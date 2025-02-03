import { useEffect } from 'react'

import { AddExpenseFields } from '../../../../features/Admin/AccountingPage/NewExpensePage/AddExpenseFields/AddExpenseFields'
import { RecentExpense } from '../../../../features/Admin/AccountingPage/NewExpensePage/RecentExpense/RecentExpense'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewExpensePage.module.scss'

export const AdminNewExpensePage = () => {
  useEffect(() => {
    document.title = 'infiniti | New Expense'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard style={styles.cardFirst} title='Add Expense'>
          <AddExpenseFields />
        </RecentCard>
        <RecentCard style={styles.cardSecond} title='Recent Expense'>
          <RecentExpense />
        </RecentCard>
      </section>
    </div>
  )
}
