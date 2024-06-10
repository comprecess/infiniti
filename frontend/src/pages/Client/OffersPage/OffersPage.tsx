import { FC, useEffect } from 'react'

import { RecentTotal } from '../../../features/Client/OffersPage/RecentTotal/RecentTotal'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const ClientOffersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Offers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard title='Total: 0' style={styles.recentFullScreen}>
          <RecentTotal />
        </RecentCard>
      </section>
    </div>
  )
}
