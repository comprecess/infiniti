import { useState } from 'react'

import styles from './ActivityLogPage.module.scss'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminActivityLogPage = () => {
  const [data] = useState({})

  const [, setSearch] = useState<string>('')

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Activity Log'
          style={styles.recentFullScreen}
          HeaderComponent={Search}
          Component={ButtonBlue}
          componentProps={{
            title: 'Clear Old Data',
            icon: '/icons/trash.svg',
            iconProps: styles.buttonIcon,
            titleNone: true,
          }}
          headerProps={{
            style: styles.search,
            onSearchChange: setSearch,
          }}
        >
          {data ? (
            <div>Content</div>
          ) : (
            <div className={styles.loading}>
              <LoadingSpinner size='xl' />
            </div>
          )}
        </RecentCard>
      </section>
    </div>
  )
}
