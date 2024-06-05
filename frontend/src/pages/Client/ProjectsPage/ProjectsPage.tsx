import { FC, useEffect } from 'react'

export const ClientProjectsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Projects'
  }, [])

  return <div>Client Projects Page</div>
}
