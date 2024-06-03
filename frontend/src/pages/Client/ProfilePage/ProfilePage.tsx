import { FC, useEffect } from 'react'

export const ClientProfilePage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Profile'
  }, [])

  return <div>Client Profile Page</div>
}
