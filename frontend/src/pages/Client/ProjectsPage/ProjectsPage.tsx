import { useEffect } from 'react'

export const ClientProjectsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Projects'
  }, [])

  return <div>Client Projects Page</div>
}
