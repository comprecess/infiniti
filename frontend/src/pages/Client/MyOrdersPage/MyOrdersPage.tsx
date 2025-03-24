import { useEffect } from 'react'

import styles from './MyOrdersPage.module.scss'

export const ClientMyOrdersPage = () => {
  useEffect(() => {
    document.title = 'infiniti | My Orders'
  }, [])

  return <div className={styles.wrapper}>Client My Orders Page</div>
}
