import { FC, useEffect } from 'react'

export const ClientMyOrdersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | My Orders'
  }, [])

  return <div>Client My Orders Page</div>
}
