import { useQuery } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import styles from './EditBusinessPlanPage.module.scss'
import { ModalAddTalentTeam } from './ModalAddTalentTeam/ModalAddTalentTeam'
import {
  BusinessPlanNewPlanFormData,
  TalentInputDataBusinessPlan,
} from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/get-business-plan-edit-info'
import { getBusinessPlanInputData } from '../../../../shared/utils/api/Admin/BusinessPlan/get-business-plan-input-data'
import { postUpdateBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/post-update-business-plan'
import { getAnalysisChatGPT } from '../../../../shared/utils/api/Admin/ChatGPT/get-analysis-chat-gpt'
import { getChatGPTReadyPrompt } from '../../../../shared/utils/api/Admin/ChatGPT/get-chat-gpt-ready-prompt'
import { getTeamDatesBusy } from '../../../../shared/utils/api/Admin/Meeting/get-team-dates-busy'
import { postCreateNewMeeting } from '../../../../shared/utils/api/Admin/Meeting/post-create-new-meeting'
import { useChatGPT } from '../../../../shared/utils/contexts/ChatGPTContext'
import { getLocalDateTimeString, useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { CreatingCallModal } from '../../../../widgets/CreatingCallModal/CreatingCallModal'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminEditBusinessPlanPage = () => {
  const [formData, setFormData] = useState<Partial<BusinessPlanNewPlanFormData> | null>(null)
  const [inputData, setInputData] = useState<TalentInputDataBusinessPlan[] | null>(null)

  const [modalAddTalent, setModalAddTalent] = useState<boolean>(false)
  const [isCreatingCall, setIsCreatingCall] = useState<boolean>(false)
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false)

  const id = useIdFromUrl('business-plan')
  const showToast = useCustomToast()

  const { chatGPTChangeForm, setChatGPTChangeForm } = useChatGPT()

  const getInfoPlan = async () => {
    if (!id) return

    const response = await getBusinessPlanInfo(id)

    if (!response.status) return

    setFormData(response.data.data)
  }

  const getInputData = async () => {
    const response = await getBusinessPlanInputData()

    if (!response.status) return

    setInputData(response.data.talents)
  }

  const { data: teamDatesBusy } = useQuery({
    queryKey: ['datesBusy'],
    queryFn: async () => {
      if (formData?.teams === undefined) return

      const teamIdsQuery = formData.teams.map(id => `ids[]=${id}`).join('&')

      const response = await getTeamDatesBusy(
        teamIdsQuery,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      if (!response.status) return

      return response.data.data
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

    const response = await getChatGPTReadyPrompt(
      `?namePrompt=selectionSpecialists&discussionModel=businessPlan&discussionId=${id}`,
    )

    if (!response.status) return

    const idsArray = response.data.ids.split(',').map((id: string) => parseInt(id.trim(), 10))

    setFormData(prevFormData => ({
      ...prevFormData,
      management: response.data.description,
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

    const response = await postUpdateBusinessPlan(id, cleanedFormData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the information in the Business Plan',
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
    const response = await getAnalysisChatGPT(`?discussionModel=businessPlan`)

    if (!response.status) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access, status, ...filteredResponse } = response.data

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

    const time = getLocalDateTimeString()
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const updatedDates = dates.map(dateStr => {
      return `${dateStr} ${selectedTime.format('HH:mm')}`
    })

    const response = await postCreateNewMeeting(
      'business-plan',
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
