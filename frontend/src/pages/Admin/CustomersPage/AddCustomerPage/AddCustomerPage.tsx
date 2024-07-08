import { FC, useEffect } from 'react'

export const AdminAddCustomerPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Add Customer'
  }, [])

  return <div>Admin Add Customer Page</div>
}
