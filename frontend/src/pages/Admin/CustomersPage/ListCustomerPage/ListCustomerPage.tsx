import { FC, useEffect } from 'react'

export const AdminListCustomerPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | List Customer'
  }, [])

  return <div>Admin List Customer Page</div>
}
