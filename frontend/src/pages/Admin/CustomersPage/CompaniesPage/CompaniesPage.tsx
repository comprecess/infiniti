import { FC, useEffect } from 'react'

export const AdminCompaniesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Companies'
  }, [])

  return <div>Admin Companies Page</div>
}
