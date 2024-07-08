import { FC, useEffect } from 'react'

export const AdminViewTransactionsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | View Transactions'
  }, [])

  return <div>Admin View Transactions Page</div>
}
