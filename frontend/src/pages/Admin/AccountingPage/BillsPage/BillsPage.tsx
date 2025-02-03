import { useEffect, useState } from 'react'

import { AddABillPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AddABillPage/AddABillPage'
import { AllPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AllPage/AllPage'
import { SummaryPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/SummaryPage/SummaryPage'
import { Tabs } from '../../../../features/Admin/AccountingPage/Bills/Tabs/Tabs'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './BillsPage.module.scss'

export const AdminBillsPage = () => {
  const [pages, setPages] = useState<string>('Summary')

  useEffect(() => {
    document.title = 'infiniti | Bills'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Bills'
          style={styles.recentFullScreen}
          HeaderComponent={Tabs}
          headerProps={{ isActiveTab: pages, setIsActiveTab: setPages }}
        >
          {pages === 'Summary' && <SummaryPage />}
          {pages === 'All' && <AllPage />}
          {pages === 'Add a Bill' && <AddABillPage />}
        </RecentCard>
      </section>
    </div>
  )
}
