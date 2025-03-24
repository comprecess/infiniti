import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { TalentData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { AboutTalentCard } from '../../../../features/Admin/TalentsPage/ViewTalentPage/AboutTalentCard/AboutTalentCard'
import { EducationCard } from '../../../../features/Admin/TalentsPage/ViewTalentPage/EducationCard/EducationCard'
import { ProjectsExperienceCard } from '../../../../features/Admin/TalentsPage/ViewTalentPage/ProjectsExperienceCard/ProjectsExperienceCard'
import { SimilarTalents } from '../../../../features/Admin/TalentsPage/ViewTalentPage/SimilarTalents/SimilarTalents'
import { TalentCard } from '../../../../features/Admin/TalentsPage/ViewTalentPage/TalentCard/TalentCard'
import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getUserInfo } from '../../../../shared/utils/api/Client/Catalog/User/GetUserInfo'
import styles from './ViewTalentPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/talent\/(\d+)/
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

export const AdminViewTalentPage = () => {
  const similarTalentsRef = useRef<HTMLDivElement>(null)

  const id = useIdFromUrl()
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    if (window.history.length - 3 <= 0) {
      navigate(`/${Routes.adminPages}/${Routes.talents}/${Routes.catalog}`)
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
                isAdmin
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
              <SimilarTalents
                isAdmin
                similarTalents={talentInfo.data.similar}
              />
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
