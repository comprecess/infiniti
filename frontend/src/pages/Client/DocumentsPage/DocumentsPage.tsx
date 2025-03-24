import { useEffect } from 'react'

import styles from './DocumentsPage.module.scss'

export const ClientDocumentsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Documents'
  }, [])

  return <div className={styles.wrapper}>Client Documents Page</div>
}
