import { FC, useEffect } from 'react'

export const ClientProjectsPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Projects'
  }, [])

  return <div>Client Projects Page</div>
}
