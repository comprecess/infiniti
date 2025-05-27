import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { getUserInfo } from '../../../shared/utils/api/Client/Catalog/User/GetUserInfo'
import { useIdFromUrl } from '../../../shared/utils/usefulMethods'
import styles from './TalentDetailsPage.module.scss'

export const ClientTalentDetailsPage = () => {
  const similarTalentsRef = useRef<HTMLDivElement>(null)

  const id = useIdFromUrl('talent')
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    if (window.history.length - 3 <= 0) {
      navigate(`/${Routes.clientPages}/${Routes.talents}`)
    } else {
      navigate(-1)
    }
  }

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  const scrollToSimilarTalents = useCallback(() => {
    setTimeout(() => {
      if (similarTalentsRef.current) {
        similarTalentsRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }, [])

  const { data: talentInfo } = useQuery({
    queryKey: ['talents', id],
    queryFn: async () => {
      if (id === null) return

      const response: { data: TalentData | null; status: boolean } =
        await getUserInfo(id)

      if (response.status) {
        return response
      } else {
        navigate('/404')

        return
      }
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'infiniti | Talent Details'
  }, [])

  return (
    <div className={styles.wrapper}>
      {talentInfo && talentInfo.data ? (
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
              <TalentCard
                talent={talentInfo.data}
                showSimilar={scrollToSimilarTalents}
              />
              <div className={styles.info}>
                <AboutTalentCard talentInfo={talentInfo.data} />
                <ProjectsExperienceCard talentInfo={talentInfo.data} />
                <EducationCard talentInfo={talentInfo.data} />
              </div>
            </div>
          </section>
          <section ref={similarTalentsRef} className={styles.section}>
            <section className={styles.item}>
              <SimilarTalents similarTalents={talentInfo.data.similar} />
            </section>
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
