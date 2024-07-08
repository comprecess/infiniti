import { FC, useEffect } from 'react'

export const AdminBillsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Bills'
  }, [])

  return <div>Admin Bills Page</div>
}
