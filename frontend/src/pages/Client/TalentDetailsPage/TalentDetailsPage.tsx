import { FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import styles from './TalentDetailsPage.module.scss'

export const TalentPage: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'infiniti | Talent Details'

    window.scrollTo(0, 0)
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigate('/' + Routes.clientPages + '/' + Routes.catalog)
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.item}>
          <div className={styles.buttonBack} onClick={handleNavigateBack}>
            <ChevronDownIcon style={styles.buttonBackIcon} />
            <span className={styles.buttonBackText}>Back</span>
          </div>
        </div>
      </section>
    </div>
  )
}
