import styles from './ViewTicketPage.module.scss'
import { dataTicket } from '../../../../app/data/test'
import { Message } from '../../../../features/Client/ViewTicketPage/Message/Message'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { Status } from '../../../../shared/ui/Status/Status'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

export const ClientViewTicketPage = () => {
  const id = useIdFromUrl('ticket')

  const data = dataTicket[id || 0]

  if (!data) return null

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>
              <TitlePage title={data.title} />
            </div>
            <Status title={data.status} status={data.status} />
          </div>
          <div className={styles.wrapper}>
            <section className={styles.section}>
              <div className={styles.tickets}>
                {data.tickets.map((ticket, index) => {
                  return (
                    <Message
                      key={ticket.id}
                      isAdmin={false}
                      isWriteMessage={false}
                      isLast={index === data.tickets.length - 1}
                      data={ticket}
                      status={data.status}
                      isNextWriteMessage={
                        data.status === 'Open' && index === data.tickets.length - 1
                      }
                    />
                  )
                })}
                {data.status === 'Open' && (
                  <Message
                    key='write-message'
                    isWriteMessage
                    isAdmin={false}
                    status={data.status}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
