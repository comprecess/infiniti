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
import { getReadyPrompt } from '../../../../shared/utils/api/Admin/ChatGPT/GetReadyPrompt'
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
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false)

  const id = useIdFromUrl()
  const showToast = useCustomToast()

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

    const response = await putUpdateInfoBusinessPlan(id, formData)

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

  useEffect(() => {
    document.title = 'infiniti | Edit Business Plan'
  }, [])

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
    </>
  )
}
