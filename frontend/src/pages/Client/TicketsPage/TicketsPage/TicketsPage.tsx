import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TicketsPage.module.scss'
import { ClientTicketsData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ViewItem } from '../../../../features/Client/TicketsPage/ViewItem/ViewItem'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const ClientTicketsPage = () => {
  const [tickets] = useState<{ data: ClientTicketsData[] } | null>({
    data: [
      {
        id: 0,
        code: '#ROE-45104617',
        title: 'Orders not works',
        updateAt: '10.10.2025',
        status: 'Open',
      },
      {
        id: 1,
        code: '#OJI-74626539',
        title: 'Sales persons for business',
        updateAt: '11.10.2025',
        status: 'Open',
      },
      {
        id: 2,
        code: '#TRY-74626539',
        title: 'Test',
        updateAt: '12.10.2025',
        status: 'Open',
      },
    ],
  })

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
        {tickets ? (
          <RecentCard
            title='Tickets'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Ticket',
              style: styles.buttonBlue,
              onClick: handleNavigateToNewTicket,
            }}
          >
            {tickets.data.length > 0 ? (
              <div className={styles.tickets}>
                {tickets.data.map(ticket => (
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
