import { FC, useEffect } from 'react'

import styles from './InvoicesPage.module.scss'

export const AdminContactInvoicesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Invoices'
  }, [])

  return <div className={styles.wrapper}>Admin Invoices Page</div>
}
