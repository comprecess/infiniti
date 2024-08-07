import { FC, useEffect } from 'react'

import styles from './MorePage.module.scss'

export const AdminContactMorePage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Contact | More'
  }, [])

  return <div className={styles.wrapper}>Admin More Page</div>
}
