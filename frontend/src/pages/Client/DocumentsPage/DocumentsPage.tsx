import { FC, useEffect } from 'react'

import styles from './DocumentsPage.module.scss'

export const ClientDocumentsPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Documents'
  }, [])

  return <div className={styles.wrapper}>Client Documents Page</div>
}
