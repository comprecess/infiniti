import { FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { AboutTalentCard } from '../../../features/Client/TalentDetailsPage/AboutTalentCard/AboutTalentCard'
import { EducationCard } from '../../../features/Client/TalentDetailsPage/EducationCard/EducationCard'
import { ProjectsExperienceCard } from '../../../features/Client/TalentDetailsPage/ProjectsExperienceCard/ProjectsExperienceCard'
import { SimilarTalents } from '../../../features/Client/TalentDetailsPage/SimilarTalents/SimilarTalents'
import { TalentCard } from '../../../features/Client/TalentDetailsPage/TalentCard/TalentCard'
import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './TalentDetailsPage.module.scss'

export const TalentPage: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'infiniti | Talent Details'

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigate('/' + Routes.clientPages + '/' + Routes.catalog)
  }, [])

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
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
      <section className={styles.section}>
        <div className={styles.item}>
          <TalentCard />
          <div className={styles.info}>
            <AboutTalentCard />
            <ProjectsExperienceCard />
            <EducationCard />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.item}>
          <SimilarTalents />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.item}>
          <ButtonBrand title='Back to top' onClick={scrollToTop} />
        </div>
      </section>
    </div>
  )
}
