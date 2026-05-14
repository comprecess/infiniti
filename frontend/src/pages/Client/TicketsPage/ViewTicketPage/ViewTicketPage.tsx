import { useEffect, useState } from 'react'

import styles from './ViewTicketPage.module.scss'
import { getClientTicket } from '../../../../shared/utils/api/Client/Tickets/get-ticket'
import { postClientTicketReply } from '../../../../shared/utils/api/Client/Tickets/post-ticket-reply'
import { postClientTicketAttachment } from '../../../../shared/utils/api/Client/Tickets/post-ticket-attachment'
import { Message } from '../../../../features/Client/ViewTicketPage/Message/Message'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

export const ClientViewTicketPage = () => {
  const id = useIdFromUrl('ticket')
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)

  const loadTicket = async () => {
    if (!id && id !== 0) return
    setLoading(true)
    const res = await getClientTicket(id)
    if (res.status) setTicket(res.data?.data?.data ?? res.data?.data ?? res.data)
    setLoading(false)
  }

  useEffect(() => {
    document.title = 'infiniti | Ticket'
    loadTicket()
  }, [id])

  const handleSend = async (message: string, _replyType?: string, files?: File[]) => {
    if (!ticket) return
    setSending(true)
    setReplyError(null)
    const res = await postClientTicketReply(ticket.id, { message })
    if (res.status) {
      // Upload attachments tied to the new reply
      if (files && files.length > 0) {
        const replyId = res.data?.data?.id ?? res.data?.id
        for (const file of files) {
          await postClientTicketAttachment(ticket.id, file)
        }
      }
      loadTicket()
    } else {
      setReplyError(res.message)
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <span>Ticket not found</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>
              <TitlePage title={ticket.subject} />
            </div>
            <Status title={ticket.status} status={ticket.status} />
          </div>
          <div className={styles.tickets}>
            {/* Original ticket message from client */}
            {ticket.message && (
              <Message
                key='original'
                isAdmin={false}
                isWriteMessage={false}
                isLast={!ticket.replies?.length}
                data={{
                  id: 0,
                  date: ticket.created_at,
                  account: { name: ticket.email ?? 'You', img: null },
                  message: ticket.message,
                }}
                status={ticket.status}
                isNextWriteMessage={false}
              />
            )}
            {ticket.replies?.map((reply: any, index: number) => {
              const isAdminReply = reply.replied_by === 'admin'
              const authorName = isAdminReply
                ? (reply.author_info?.name ?? reply.admin ?? 'Support')
                : (ticket.email ?? 'You')
              return (
                <Message
                  key={reply.id}
                  isAdmin={isAdminReply}
                  isWriteMessage={false}
                  isLast={index === ticket.replies.length - 1}
                  data={{
                    id: reply.id,
                    date: reply.created_at,
                    account: { name: authorName, img: null },
                    message: reply.body ?? reply.message,
                    files: reply.files ?? [],
                  }}
                  status={ticket.status}
                  isNextWriteMessage={false}
                />
              )
            })}
            {ticket.status !== 'Closed' && (
              <Message
                key='write-message'
                isWriteMessage
                isAdmin={false}
                status={ticket.status}
                onSend={handleSend}

                sending={sending}
                sendError={replyError}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
