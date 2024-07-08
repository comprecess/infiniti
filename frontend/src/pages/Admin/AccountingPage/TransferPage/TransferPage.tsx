import { FC, useEffect } from 'react'

export const AdminTransferPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Transfer'
  }, [])

  return <div>Admin Transfer Page</div>
}
