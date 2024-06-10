import { FC, useEffect } from 'react'

import { RecentInvoices } from '../../../features/Client/InvoicesPage/RecentInvoices/RecentInvoices'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const ClientInvoicesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Invoices'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.item}>Chart</div>
      </section>
      <section className={styles.section}>
        <RecentCard title='Total: 0' style={styles.recentFullScreen}>
          <RecentInvoices />
        </RecentCard>
      </section>
    </div>
  )
}
