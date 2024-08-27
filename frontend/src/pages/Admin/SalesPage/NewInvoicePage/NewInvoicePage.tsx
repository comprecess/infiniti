import { FC, useEffect } from 'react'

import styles from './NewInvoicePage.module.scss'

export const AdminNewInvoicePage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | New Invoices'
  }, [])

  return <div className={styles.wrapper}>Admin New Invoice Page</div>
}
