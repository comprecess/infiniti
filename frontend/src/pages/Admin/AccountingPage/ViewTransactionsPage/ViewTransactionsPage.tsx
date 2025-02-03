import { useEffect } from 'react'

import { Filters } from '../../../../features/Admin/AccountingPage/ViewTransactions/Filters/Filters'
import { TableTransactions } from '../../../../features/Admin/AccountingPage/ViewTransactions/TableTransactions/TableTransactions'
import { RecentRightButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentRightButtons/RecentRightButtons'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewTransactionsPage.module.scss'

export const AdminViewTransactionsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | View Transactions'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          style={styles.recentFullScreen}
          title='View Transactions'
        >
          <div className={styles.container}>
            <div className={styles.filters}>
              <Filters />
            </div>
            <div className={styles.buttonsAndTable}>
              <RecentRightButtons />
              <TableTransactions />
            </div>
          </div>
        </RecentCard>
      </section>
    </div>
  )
}
