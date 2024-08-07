import { FC, useEffect } from 'react'

import styles from './ActivityPage.module.scss'

export const AdminContactActivityPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Activity'
  }, [])

  return <div className={styles.wrapper}>Admin Activity Page</div>
}
