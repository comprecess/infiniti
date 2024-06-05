import { FC, useEffect } from 'react'

export const ClientOffersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Offers'
  }, [])

  return <div>Client Offers Page</div>
}
