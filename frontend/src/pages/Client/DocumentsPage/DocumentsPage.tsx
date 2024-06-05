import { FC, useEffect } from 'react'

export const ClientDocumentsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Documents'
  }, [])

  return <div>Client Documents Page</div>
}
