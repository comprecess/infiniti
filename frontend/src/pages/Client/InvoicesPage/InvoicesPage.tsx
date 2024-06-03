import { FC, useEffect } from 'react'

export const ClientInvoicesPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Invoices'
  }, [])

  return <div>Client Invoices Page</div>
}
