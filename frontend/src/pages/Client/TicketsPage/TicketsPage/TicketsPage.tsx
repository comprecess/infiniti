import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TicketsPage.module.scss'
import { dataTicket } from '../../../../app/data/test'
import { Routes } from '../../../../app/router/routes'
import { ViewItem } from '../../../../features/Client/TicketsPage/ViewItem/ViewItem'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const ClientTicketsPage = () => {
  const navigate = useNavigate()

  const handleNavigateToNewTicket = () => {
    navigate(`/${Routes.clientPages}/${Routes.tickets}/${Routes.new}/${Routes.ticket}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Tickets'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {dataTicket ? (
          <RecentCard
            title='Tickets'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Ticket',
              onClick: handleNavigateToNewTicket,
            }}
          >
            {dataTicket.length > 0 ? (
              <div className={styles.tickets}>
                {dataTicket.map(ticket => (
                  <ViewItem key={ticket.id} data={ticket} />
                ))}
              </div>
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )}
          </RecentCard>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )}
      </section>
    </div>
  )
}
