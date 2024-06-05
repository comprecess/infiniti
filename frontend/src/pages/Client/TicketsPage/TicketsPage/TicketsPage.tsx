import { FC, useEffect } from 'react'

export const ClientTicketsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Tickets'
  }, [])

  return <div>Client Tickets Page</div>
}
