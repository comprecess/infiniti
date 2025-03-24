import { useEffect } from 'react'

import styles from './TransactionsPage.module.scss'

export const ClientTransactionsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Transactions'
  }, [])

  return <div className={styles.wrapper}>Client Transactions Page</div>
}
