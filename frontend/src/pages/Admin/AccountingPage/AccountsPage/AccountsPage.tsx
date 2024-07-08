import { FC, useEffect } from 'react'

export const AdminAccountsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Accounts'
  }, [])

  return <div>Admin Accounts Page</div>
}
