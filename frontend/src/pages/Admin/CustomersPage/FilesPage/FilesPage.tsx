import { FC, useEffect } from 'react'

export const AdminFilesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Files'
  }, [])

  return <div>Admin Files Page</div>
}
