import { FC, useEffect } from 'react'

export const AdminGroupsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Groups'
  }, [])

  return <div>Admin Groups Page</div>
}
