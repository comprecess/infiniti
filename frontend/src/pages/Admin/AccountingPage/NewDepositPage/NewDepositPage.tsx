import { FC, useEffect } from 'react'

export const AdminNewDepositPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | New Deposit'
  }, [])

  return <div>Admin New Deposit Page</div>
}
