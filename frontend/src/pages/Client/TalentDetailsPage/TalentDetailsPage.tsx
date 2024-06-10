import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TalentDetailsPage.module.scss'

export const TalentPage: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'infiniti | Talent Details'

    window.scrollTo(0, 0)
  }, [])

  return <div className={styles.wrapper}>d</div>
}
