import { useEffect } from 'react'

import styles from './OpenNewTicketPage.module.scss'
import { Fields } from '../../../../features/Client/TicketsPage/Fields/Fields'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const ClientOpenNewTicketPage = () => {
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
