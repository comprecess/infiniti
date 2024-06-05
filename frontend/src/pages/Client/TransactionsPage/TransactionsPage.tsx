import { FC, useEffect } from 'react'

export const ClientTransactionsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Transactions'
  }, [])

  return <div>Client Transactions Page</div>
}
