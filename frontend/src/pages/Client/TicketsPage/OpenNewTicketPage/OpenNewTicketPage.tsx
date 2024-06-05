import { FC, useEffect } from 'react'

export const ClientOpenNewTicketPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Open New Ticket'
  }, [])

  return <div>Client Open New Ticket Page</div>
}
