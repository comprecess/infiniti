import { FC, useEffect } from 'react'

import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AddCustomerPage.module.scss'

export const AdminAddCustomerPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Add Customer'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Add Contact'
          style={styles.recentFullScreen}
          Component={ButtonBlue}
          componentProps={{
            title: 'Import Conatcts',
            style: styles.blueButton,
            icon: '/icons/import.svg',
            iconProps: styles.icon,
            titleNone: true,
          }}
        >
          Content
        </RecentCard>
      </section>
    </div>
  )
}
