import { useState } from 'react'

import styles from './ViewTicketPage.module.scss'
import { ClientTicketsListData } from '../../../../app/constants/constants'
import { Message } from '../../../../features/Client/ViewTicketPage/Message/Message'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'

export const ClientViewTicketPage = () => {
  const [data] = useState<ClientTicketsListData>({
    title: 'Test Task',
    status: 'Open',
    tickets: [
      {
        id: 0,
        date: '10/10/2025',
        account: { name: 'Paul D.', img: null },
        message: 'Pls. Ch',
      },
      {
        id: 1,
        date: '11/10/2025',
        account: { name: 'Alexey', img: null },
        message: 'Test da test',
      },
      {
        id: 2,
        date: '12/10/2025',
        account: { name: 'Paul D.', img: null },
        message: 'Pls. Ch',
      },
    ],
  })

  return (
    <div>
      <div className={styles.title}>
        <TitlePage title={data.title} />
      </div>
      <div className={styles.wrapper}>
        {data ? (
          <section className={styles.section}>
            <div className={styles.tickets}>
              {data.tickets.map((ticket, index) => {
                return (
                  <Message
                    key={ticket.id}
                    isWriteMessage={false}
                    isLast={index === data.tickets.length - 1}
                    isNextWriteMessage={data.status === 'Open' && index === data.tickets.length - 1}
                    data={ticket}
                    status={data.status}
                  />
                )
              })}
              {data.status === 'Open' && (
                <Message key='write-message' isWriteMessage status={data.status} />
              )}
            </div>
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
    </div>
  )
}
