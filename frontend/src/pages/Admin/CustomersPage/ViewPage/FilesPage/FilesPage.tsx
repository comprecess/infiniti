import { FC, useEffect } from 'react'

import styles from './FilesPage.module.scss'

export const AdminContactFilesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Files'
  }, [])

  return <div className={styles.wrapper}>Admin Files Page</div>
}
