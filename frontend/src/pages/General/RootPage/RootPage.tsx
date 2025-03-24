import { useEffect } from 'react'

import styles from './RootPage.module.scss'

export const RootPage = () => {
  useEffect(() => {
    document.title = 'Infiniti | Root'
  }, [])

  return <div className={styles.wrapper} />
}
