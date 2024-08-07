import { FC, useEffect } from 'react'

import styles from './LogPage.module.scss'

export const AdminContactLogPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Log'
  }, [])

  return <div className={styles.wrapper}>Admin Log Page</div>
}
