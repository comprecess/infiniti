import { FC, useEffect } from 'react'

export const ClientOffersPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Offers'
  }, [])

  return <div>Client Offers Page</div>
}
