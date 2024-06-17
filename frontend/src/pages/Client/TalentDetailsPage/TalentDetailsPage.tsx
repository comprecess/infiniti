import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { TalentData } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { AboutTalentCard } from '../../../features/Client/TalentDetailsPage/AboutTalentCard/AboutTalentCard'
import { EducationCard } from '../../../features/Client/TalentDetailsPage/EducationCard/EducationCard'
import { ProjectsExperienceCard } from '../../../features/Client/TalentDetailsPage/ProjectsExperienceCard/ProjectsExperienceCard'
import { SimilarTalents } from '../../../features/Client/TalentDetailsPage/SimilarTalents/SimilarTalents'
import { TalentCard } from '../../../features/Client/TalentDetailsPage/TalentCard/TalentCard'
import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getUserInfo } from '../../../shared/utils/api/Catalog/User/GetUserInfo'
import styles from './TalentDetailsPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/id(\d+)/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()
  const id = useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )

  return id
}

export const TalentPage: FC = () => {
  const [talentInfo, setTalentInfo] = useState<TalentData | null>(null)

  const id = useIdFromUrl()

  const navigate = useNavigate()

  const handleNavigateBack = useCallback(() => {
    navigate('/' + Routes.clientPages + '/' + Routes.catalog)
  }, [navigate])

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  const getInfo = useCallback(async () => {
    if (id !== null) {
      const talentsData = await getUserInfo(id)

      if (talentsData) {
        setTalentInfo(talentsData.data)
      } else {
        navigate('/404')
      }
    } else {
      navigate('/404')
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Talent Details'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {talentInfo ? (
        <>
          <section className={styles.section}>
            <div className={styles.item}>
              <div
                className={styles.buttonBack}
                onClick={handleNavigateBack}
              >
                <ChevronDownIcon style={styles.buttonBackIcon} />
                <span className={styles.buttonBackText}>Back</span>
              </div>
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.listItems}>
              <TalentCard talent={talentInfo} />
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
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
