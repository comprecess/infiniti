import { FC, useEffect } from 'react'

import styles from './AddSupplierPage.module.scss'

export const AdminAddSupplierPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Add Supplier'
  }, [])

  return <div className={styles.wrapper}>Admin Add Supplier Page</div>
}
