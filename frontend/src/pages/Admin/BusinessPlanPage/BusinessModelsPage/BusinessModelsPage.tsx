import { useEffect } from 'react'

import styles from './BusinessModelsPage.module.scss'

export const AdminBusinessModelsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Business Models'
  }, [])

  return <div className={styles.wrapper}>Admin Business Models Page</div>
}
