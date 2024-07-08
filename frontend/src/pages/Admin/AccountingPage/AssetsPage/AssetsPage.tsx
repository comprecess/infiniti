import { FC, useEffect } from 'react'

export const AdminAssetsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Assets'
  }, [])

  return <div>Admin Assets Page</div>
}
