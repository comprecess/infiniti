import { FC, useEffect } from 'react'

import styles from './PasswordManagerPage.module.scss'

export const AdminContactPasswordManagerPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Password Manager'
  }, [])

  return <div className={styles.wrapper}>Admin Password Manager Page</div>
}
