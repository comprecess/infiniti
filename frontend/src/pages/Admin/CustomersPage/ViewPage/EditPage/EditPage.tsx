import { FC, useEffect } from 'react'

import styles from './EditPage.module.scss'

export const AdminContactEditPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | Edit'
  }, [])

  return <div className={styles.wrapper}>Admin Edit Page</div>
}
