import { FC, useEffect } from 'react'

import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminFilesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Files'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Files uploaded by Customers'
          style={styles.recentFullScreen}
        >
          Content
        </RecentCard>
      </section>
    </div>
  )
}
