import { useQuery } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './TalentDetailsPage.module.scss'
import { TalentData } from '../../../app/constants/constants'
import { AboutTalentCard } from '../../../features/Client/TalentDetailsPage/AboutTalentCard/AboutTalentCard'
import { EducationCard } from '../../../features/Client/TalentDetailsPage/EducationCard/EducationCard'
import { ProjectsExperienceCard } from '../../../features/Client/TalentDetailsPage/ProjectsExperienceCard/ProjectsExperienceCard'
import { SimilarTalents } from '../../../features/Client/TalentDetailsPage/SimilarTalents/SimilarTalents'
import { TalentCard } from '../../../features/Client/TalentDetailsPage/TalentCard/TalentCard'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getTalentDatesBusy } from '../../../shared/utils/api/Admin/Meeting/get-talent-dates-busy'
import { postCreateNewMeeting } from '../../../shared/utils/api/Admin/Meeting/post-create-new-meeting'
import { getUserInfo } from '../../../shared/utils/api/Client/Catalog/User/get-user-info'
import {
  getLocalDateTimeString,
  useIdFromUrl,
} from '../../../shared/utils/usefulMethods'
import { CreatingCallModal } from '../../../widgets/CreatingCallModal/CreatingCallModal'

export const ClientTalentDetailsPage = () => {
  const [isCreatingCall, setIsCreatingCall] = useState<boolean>(false)

  const similarTalentsRef = useRef<HTMLDivElement>(null)

  const id = useIdFromUrl('talent')
  const showToast = useCustomToast()

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

  const { data: talentDatesBusy } = useQuery({
    queryKey: ['talentDatesBusyClient', id],
    queryFn: async () => {
      if (id === null) return

      const response = await getTalentDatesBusy(
        id,
        'individual',
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      if (!response.status) return

      return response.data
    },
  })

  const createMeetingWithTalent = async (
    dates: string[] | null,
    selectedTime: Dayjs | null,
  ) => {
    if (id === null || dates === null || selectedTime === null) return

    const time = getLocalDateTimeString()
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const updatedDates = dates.map(dateStr => {
      return `${dateStr} ${selectedTime.format('HH:mm')}`
    })

    const response = await postCreateNewMeeting(
      'individual',
      updatedDates[0],
      {
        date: time,
        name: userTimeZone,
      },
      id,
    )

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a meeting in Zoom',
        status: 'success',
      })
      setIsCreatingCall(prev => !prev)
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    document.title = 'infiniti | Talent Details'
  }, [])

  return (
    <>
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
                  onPhone={() => setIsCreatingCall(prev => !prev)}
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
                <ButtonBrand title='Back to top' style={styles.button} onClick={scrollToTop} />
              </div>
            </section>
          </>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
      {talentDatesBusy && (
        <CreatingCallModal
          isOpen={isCreatingCall}
          datesEmployment={talentDatesBusy.data}
          onClose={() => setIsCreatingCall(prev => !prev)}
          onClick={createMeetingWithTalent}
        />
      )}
    </>
  )
}
