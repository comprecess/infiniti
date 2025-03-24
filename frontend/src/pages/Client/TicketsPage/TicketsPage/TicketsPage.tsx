import { useEffect } from 'react'

export const ClientTicketsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Tickets'
  }, [])

  return <div>Client Tickets Page</div>
}
