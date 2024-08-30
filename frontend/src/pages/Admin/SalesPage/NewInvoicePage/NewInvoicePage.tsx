import { FC, useEffect, useState } from 'react'

import { Fields } from '../../../../features/Admin/Sales/NewInvoice/Fields/Fields'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewInvoicePage.module.scss'

export const AdminNewInvoicePage: FC = () => {
  const [data] = useState<null>(null)

  useEffect(() => {
    document.title = 'infiniti | New Invoices'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {!data ? (
          <RecentCard title='id' style={styles.recentFullScreen}>
            <Fields />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
