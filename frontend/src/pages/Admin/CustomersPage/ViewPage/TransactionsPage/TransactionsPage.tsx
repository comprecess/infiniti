import { FC, useEffect } from 'react'

import styles from './TransactionsPage.module.scss'

export const AdminContactTransactionsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Transactions'
  }, [])

  return <div className={styles.wrapper}>Admin Transactions Page</div>
}
