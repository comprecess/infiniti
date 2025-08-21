import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'

import { TalentData } from '../../../app/constants/constants'
import { AboutTalentCard } from '../../../features/Client/TalentDetailsPage/AboutTalentCard/AboutTalentCard'
import { EducationCard } from '../../../features/Client/TalentDetailsPage/EducationCard/EducationCard'
import { ProjectsExperienceCard } from '../../../features/Client/TalentDetailsPage/ProjectsExperienceCard/ProjectsExperienceCard'
import { SimilarTalents } from '../../../features/Client/TalentDetailsPage/SimilarTalents/SimilarTalents'
import { TalentCard } from '../../../features/Client/TalentDetailsPage/TalentCard/TalentCard'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getUserInfo } from '../../../shared/utils/api/Client/Catalog/User/get-user-info'
import { useIdFromUrl } from '../../../shared/utils/usefulMethods'
import styles from './TalentDetailsPage.module.scss'

export const ClientTalentDetailsPage = () => {
  const similarTalentsRef = useRef<HTMLDivElement>(null)

  const id = useIdFromUrl('talent')

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

      const response = await getUserInfo(id)

      if (!response.status) return null

      return response.data as { data: TalentData | null; status: boolean }
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    document.title = 'infiniti | Talent Details'
  }, [])

  return (
    <div className={styles.wrapper}>
      {talentInfo && talentInfo.data ? (
        <>
          <div className={styles.backButton}>
            <BackButton />
          </div>
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
