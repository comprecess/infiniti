import { FC, useEffect } from 'react'

import styles from './TalentDetailsPage.module.scss'

export const TalentPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Talent Details'

    window.scrollTo(0, 0)
  }, [])

  return <div className={styles.wrapper}>A</div>
}
