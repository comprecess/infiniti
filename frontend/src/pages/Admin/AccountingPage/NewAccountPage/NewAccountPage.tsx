import { FC, useEffect } from 'react'

export const AdminNewAccountPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | New Account'
  }, [])

  return <div>Admin New Account Page</div>
}
