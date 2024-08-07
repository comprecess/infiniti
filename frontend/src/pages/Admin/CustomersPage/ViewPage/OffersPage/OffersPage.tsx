import { FC, useEffect } from 'react'

import styles from './OffersPage.module.scss'

export const AdminContactOffersPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Offers'
  }, [])

  return <div className={styles.wrapper}>Admin Offers Page</div>
}
