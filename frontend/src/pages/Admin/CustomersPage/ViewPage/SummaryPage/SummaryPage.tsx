import { FC, useEffect } from 'react'

import styles from './SummaryPage.module.scss'

export const AdminContactSummaryPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Summary'
  }, [])

  return <div className={styles.wrapper}>Admin Summary Page</div>
}
