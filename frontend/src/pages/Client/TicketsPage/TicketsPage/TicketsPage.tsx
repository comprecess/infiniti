import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TicketsPage.module.scss'
import { Routes } from '../../../../app/router/routes'
import { ViewItem } from '../../../../features/Client/TicketsPage/ViewItem/ViewItem'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { getClientTicketsList } from '../../../../shared/utils/api/Client/Tickets/get-tickets-list'

export const ClientTicketsPage = () => {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  const handleNavigateToNewTicket = () => {
    navigate(`/${Routes.clientPages}/${Routes.tickets}/${Routes.new}/${Routes.ticket}`)
  }

  const loadTickets = async () => {
    setLoading(true)
    const res = await getClientTicketsList()
    if (res.status && res.data?.data?.data) {
      setTickets(res.data.data.data)
    } else {
      setTickets([])
    }
    setLoading(false)
  }

  useEffect(() => {
    document.title = 'infiniti | Tickets'
    loadTickets()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {loading ? (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        ) : (
          <RecentCard
            title='Tickets'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Ticket',
              onClick: handleNavigateToNewTicket,
            }}
          >
            {tickets && tickets.length > 0 ? (
              <div className={styles.tickets}>
                {tickets.map(ticket => (
                  <ViewItem key={ticket.id} data={ticket} />
                ))}
              </div>
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )}
          </RecentCard>
        )}
      </section>
    </div>
  )
}
