import { FC, useEffect, useState } from 'react'

import { Fields } from '../../../../features/Admin/Sales/NewInvoice/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
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
          <RecentCard
            title='TEST-00032'
            style={styles.recentFullScreen}
            Component={HeaderButtons}
          >
            <Fields />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
