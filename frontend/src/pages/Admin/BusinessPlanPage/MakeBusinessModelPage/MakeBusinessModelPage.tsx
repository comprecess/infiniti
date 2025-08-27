import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BusinessModelInputData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/BusinessPlanPage/MakeBusinessModel/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessModelInputData } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-input-data'
import { postCreateNewBusinessModel } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/post-create-new-business-model'
import { getAnalysisChatGPT } from '../../../../shared/utils/api/Admin/ChatGPT/get-analysis-chat-gpt'
import { useChatGPT } from '../../../../shared/utils/Contexts/ChatGPTContext'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './MakeBusinessModelPage.module.scss'

export const AdminMakeBusinessModelPage = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})
  const [inputData, setInputData] =
    useState<BusinessModelInputData | null>(null)

  const { t } = useTranslation()
  const { chatGPTChangeForm, setChatGPTChangeForm } = useChatGPT()

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getModelInputData = async () => {
    const response = await getBusinessModelInputData()

    if (!response.status) return

    const { industries, technologies, ...otherData } = response.data

    const updatedResponse = {
      industries: industries.map((industry: any) => ({
        value: industry.value.replace(/&amp;/g, '&'),
      })),
      technologies: technologies.map((keySkill: any) => ({
        value: keySkill.value.replace(/&amp;/g, '&'),
      })),
      ...otherData,
    }

    setInputData(updatedResponse)
  }

  const handleCreateNewBusinessModel = async () => {
    if (!formData) return

    const response = await postCreateNewBusinessModel(formData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Business Model',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.businessModels}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  const handleGetFormInfo = async () => {
    const response = await getAnalysisChatGPT(
      '?discussionModel=businessModel',
    )

    if (!response.status) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access, status, ...filteredResponse } = response.data

    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, ...filteredResponse }

      return updatedFormData
    })

    setChatGPTChangeForm(false)
  }

  useEffect(() => {
    if (chatGPTChangeForm) handleGetFormInfo()
  }, [chatGPTChangeForm])

  useEffect(() => {
    getModelInputData()

    document.title = 'infiniti | Create Business Model'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title={t('admin-make-business-model-page-title')}
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: `${t('admin-make-business-model-page-button-1')}`,
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleCreateNewBusinessModel,
            }}
          >
            <Fields
              inputData={inputData}
              formData={formData}
              setFormData={setFormData}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
