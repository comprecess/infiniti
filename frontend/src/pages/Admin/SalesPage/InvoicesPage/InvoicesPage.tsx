import { FC, useEffect } from 'react'

import styles from './InvoicesPage.module.scss'

export const AdminInvoicesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Invoices'
  }, [])

  return <div className={styles.wrapper}>Admin Invoices Page</div>
}
