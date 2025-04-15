import { useQuery } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  BusinessPlanNewPlanFormData,
  TalentInputDataBusinessPlan,
} from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/GetBusinessPlanInfo'
import { getInputDataBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/GetInputDataBusinessPlan'
import { putUpdateInfoBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/PutUpdateInfoBusinessPlan'
import { getChatGPTAnalysis } from '../../../../shared/utils/api/Admin/ChatGPT/GetChatGPTAnalysis'
import { getReadyPrompt } from '../../../../shared/utils/api/Admin/ChatGPT/GetReadyPrompt'
import { getDatesTeamBusy } from '../../../../shared/utils/api/Admin/Meeting/GetDatesTeamBusy'
import { postCreateNewMeeting } from '../../../../shared/utils/api/Admin/Meeting/PostCreateNewMeeting'
import { useChatGPT } from '../../../../shared/utils/Contexts/ChatGPTContext'
import {
  CreatingCallModal,
  TimeSlotsById,
} from '../../../../widgets/CreatingCallModal/CreatingCallModal'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditBusinessPlanPage.module.scss'
import { ModalAddTalentTeam } from './ModalAddTalentTeam/ModalAddTalentTeam'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/business-plan\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminEditBusinessPlanPage = () => {
  const [formData, setFormData] =
    useState<Partial<BusinessPlanNewPlanFormData> | null>(null)
  const [inputData, setInputData] = useState<
  TalentInputDataBusinessPlan[] | null
  >(null)

  const [modalAddTalent, setModalAddTalent] = useState<boolean>(false)
  const [isCreatingCall, setIsCreatingCall] = useState<boolean>(false)
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false)

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const { chatGPTChangeForm, setChatGPTChangeForm } = useChatGPT()

  const getInfoPlan = async () => {
    if (!id) return

    const response = await getBusinessPlanInfo(id)

    setFormData(response.data)
  }

  const getInputData = async () => {
    const response: { talents: TalentInputDataBusinessPlan[] } =
      await getInputDataBusinessPlan()

    setInputData(response.talents)
  }

  const { data: teamDatesBusy } = useQuery({
    queryKey: ['datesBusy'],
    queryFn: async () => {
      if (formData?.teams === undefined) return

      const teamIdsQuery = formData.teams
        .map(id => `ids[]=${id}`)
        .join('&')

      const response: { data: TimeSlotsById } = await getDatesTeamBusy(
        teamIdsQuery,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      return response.data
    },
    enabled: (formData?.teams?.length ?? 0) > 0,
  })

  const addTalent = (id: number) => {
    if (formData && formData.teams) {
      if (!formData.teams.includes(id)) {
        const updatedTeams = [...formData.teams, id]

        setFormData(prevFormData => ({
          ...prevFormData,
          teams: updatedTeams,
        }))
      }
    }
  }

  const deleteTalent = (id: number) => {
    if (formData && formData.teams) {
      const updatedTeams = formData.teams.filter(teamId => teamId !== id)

      setFormData(prevFormData => ({
        ...prevFormData,
        teams: updatedTeams,
      }))
    }
  }

  const addNewTalentChatGPT = async () => {
    if (!id) return

    setIsLoadingTeam(true)

    const response: { ids: string; description: string } =
      await getReadyPrompt(
        `?namePrompt=selectionSpecialists&discussionModel=businessPlan&discussionId=${id}`,
      )

    const idsArray = response.ids
      .split(',')
      .map(id => parseInt(id.trim(), 10))

    setFormData(prevFormData => ({
      ...prevFormData,
      management: response.description,
      teams: idsArray,
    }))

    setIsLoadingTeam(false)
  }

  const updateInfoPlan = async () => {
    if (!id || formData === null) return

    const cleanedFormData = { ...formData }

    if (typeof cleanedFormData.file === 'string') {
      delete cleanedFormData.file
    }

    const response = await putUpdateInfoBusinessPlan(id, cleanedFormData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully changed the information in the Business Plan',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  const handleGetFormInfo = async () => {
    const response = await getChatGPTAnalysis(
      `?discussionModel=businessPlan`,
    )

    if (!response) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access, status, ...filteredResponse } = response

    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, ...filteredResponse }

      return updatedFormData
    })

    setChatGPTChangeForm(false)
  }

  const createMeetingWithBusinessPlan = async (
    dates: string[] | null,
    selectedTime: Dayjs | null,
  ) => {
    if (id === null || dates === null || selectedTime === null) return

    const time = selectedTime.format('HH:mm')
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const updatedDates = dates.map(dateStr => {
      return `${dateStr} ${time}`
    })

    const response = await postCreateNewMeeting(
      'business-plan',
      updatedDates[0],
      timeZone,
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

  useEffect(() => {
    document.title = 'infiniti | Edit Business Plan'
  }, [])

  useEffect(() => {
    if (chatGPTChangeForm) handleGetFormInfo()
  }, [chatGPTChangeForm])

  useEffect(() => {
    getInfoPlan()
    getInputData()
  }, [id])

  return (
    <>
      <div className={styles.wrapper}>
        {formData && inputData ? (
          <section className={styles.section}>
            <RecentCard
              title='Edit Business Plan'
              style={styles.recentFullScreen}
              Component={ButtonBlue}
              componentProps={{
                titleNone: true,
                title: 'Save',
                style: styles.buttonSave,
                iconProps: styles.buttonSaveIcon,
                icon: '/icons/fileWhite.svg',
                onClick: updateInfoPlan,
              }}
            >
              <Fields
                isLoadingTeam={isLoadingTeam}
                formData={formData}
                inputData={inputData}
                setFormData={setFormData}
                setModalAddTalent={setModalAddTalent}
                addNewTalentChatGPT={addNewTalentChatGPT}
                deleteTalent={deleteTalent}
                setIsCreatingCall={setIsCreatingCall}
              />
            </RecentCard>
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
      {modalAddTalent && inputData && formData && (
        <ModalAddTalentTeam
          inputData={inputData}
          teams={formData.teams}
          isOpen={modalAddTalent}
          addTalent={addTalent}
          deleteTalent={deleteTalent}
          onClose={() => setModalAddTalent(prev => !prev)}
        />
      )}
      {teamDatesBusy && (
        <CreatingCallModal
          isOpen={isCreatingCall}
          datesEmployment={teamDatesBusy}
          onClose={() => setIsCreatingCall(prev => !prev)}
          onClick={createMeetingWithBusinessPlan}
        />
      )}
    </>
  )
}
