import { FC, useEffect } from 'react'

export const ClientInvoicesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Invoices'
  }, [])

  return <div>Client Invoices Page</div>
}
