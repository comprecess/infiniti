import { useEffect } from 'react'

export const ClientOpenNewTicketPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Open New Ticket'
  }, [])

  return <div>Client Open New Ticket Page</div>
}
