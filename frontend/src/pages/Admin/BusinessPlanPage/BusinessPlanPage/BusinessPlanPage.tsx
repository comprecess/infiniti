import { FC, useEffect } from 'react'

export const AdminBusinessPlanPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Business Plan'
  }, [])

  return <div>Admin Business Plan Page</div>
}
