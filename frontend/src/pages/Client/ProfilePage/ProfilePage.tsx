import { FC, useEffect } from 'react'

export const ClientProfilePage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Profile'
  }, [])

  return <div>Client Profile Page</div>
}
