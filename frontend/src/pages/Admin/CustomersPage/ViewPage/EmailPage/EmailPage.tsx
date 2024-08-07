import { FC, useEffect } from 'react'

import styles from './EmailPage.module.scss'

export const AdminContactEmailPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Email'
  }, [])

  return <div className={styles.wrapper}>Admin Email Page</div>
}
