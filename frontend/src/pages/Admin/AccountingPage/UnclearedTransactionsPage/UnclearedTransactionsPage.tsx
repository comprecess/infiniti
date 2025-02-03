import { useEffect } from 'react'

import { TableUnclearedTransactions } from '../../../../features/Admin/AccountingPage/UnclearedTransactions/TableUnclearedTransactions/TableUnclearedTransactions'
import { Search } from '../../../../shared/ui/Search/Search'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './UnclearedTransactionsPage.module.scss'

export const AdminUnclearedTransactionsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Uncleared Transactions'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          style={styles.recentFullScreen}
          title='Uncleared Transactions'
          HeaderComponent={Search}
          headerProps={{ style: styles.search, onSearchChange: () => {} }}
        >
          <TableUnclearedTransactions />
        </RecentCard>
      </section>
    </div>
  )
}
