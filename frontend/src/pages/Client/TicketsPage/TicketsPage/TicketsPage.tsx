import { FC, useEffect } from 'react'

export const ClientTicketsPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Tickets'
  }, [])

  return <div>Client Tickets Page</div>
}
