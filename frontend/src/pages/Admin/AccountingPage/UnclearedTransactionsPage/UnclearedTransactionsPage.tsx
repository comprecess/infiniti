import { FC, useEffect } from 'react'

export const AdminUnclearedTransactionsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Uncleared Transactions'
  }, [])

  return <div>Admin Uncleared Transactions Page</div>
}
