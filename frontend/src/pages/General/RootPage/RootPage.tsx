import { FC, useEffect } from 'react'

import styles from './RootPage.module.scss'

export const RootPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Root'
  }, [])

  return <div className={styles.wrapper} />
}
