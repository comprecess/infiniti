import { FC, useEffect } from 'react'

export const AdminNewExpensePage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | New Expense'
  }, [])

  return <div>Admin New Expense Page</div>
}
