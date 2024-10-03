import { FC, useEffect } from 'react'

import styles from './ListSuppliersPage.module.scss'

export const AdminListSuppliersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | List Suppliers'
  }, [])

  return <div className={styles.wrapper}>Admin List Suppliers Page</div>
}
