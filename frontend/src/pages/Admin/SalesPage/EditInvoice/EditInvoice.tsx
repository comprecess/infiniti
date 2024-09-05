import { FC, useState } from 'react'

import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditInvoice.module.scss'

export const AdminEditInvoice: FC = () => {
  const [inputData] = useState<null>(null)

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {!inputData ? (
          <RecentCard
            title={`---Test---`}
            style={styles.recentFullScreen}
            Component={HeaderButtons}
          >
            Content
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
