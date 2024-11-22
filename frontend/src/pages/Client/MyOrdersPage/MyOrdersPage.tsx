import { FC, useEffect } from 'react'

import styles from './MyOrdersPage.module.scss'

export const ClientMyOrdersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | My Orders'
  }, [])

  return <div className={styles.wrapper}>Client My Orders Page</div>
}
