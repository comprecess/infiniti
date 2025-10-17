import { useEffect } from 'react'

import styles from './NewTicketPage.module.scss'
import { Fields } from '../../../../features/Admin/SupportPage/NewTicketPage/Fields/Fields'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminNewTicketPage = () => {
  useEffect(() => {
    document.title = 'infiniti | New Ticket'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard title='New Ticket' style={styles.recentFullScreen}>
          <Fields />
        </RecentCard>
      </section>
    </div>
  )
}
