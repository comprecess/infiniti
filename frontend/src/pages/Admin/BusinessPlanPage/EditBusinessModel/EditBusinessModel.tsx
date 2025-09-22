import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './EditBusinessModel.module.scss'
import {
  BusinessModelInputData,
  ValuesProps,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/BusinessPlanPage/EditBusinessModel/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessModelEditInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-edit-info'
import { getBusinessModelInputData } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-input-data'
import { postAddBusinessModelPicture } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/post-add-business-model-picture'
import { putRemoveBusinessModelPicture } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/put-remove-business-model-picture'
import { putUpdateBusinessModel } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/put-update-business-model'
import { getAnalysisChatGPT } from '../../../../shared/utils/api/Admin/ChatGPT/get-analysis-chat-gpt'
import { useChatGPT } from '../../../../shared/utils/Contexts/ChatGPTContext'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminEditBusinessModel = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})
  const [inputData, setInputData] =
    useState<BusinessModelInputData | null>(null)

  const { t } = useTranslation()
  const { chatGPTChangeForm, setChatGPTChangeForm } = useChatGPT()

  const id = useIdFromUrl('business-model')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getModelData = async () => {
    if (id === null) return

    const response = await getBusinessModelEditInfo(id)

    if (!response.status) return

    const { property, ...otherData } = response.data.data

    const typedProperty = property as Array<{
      [key: string]: ValuesProps[]
    }>

    const propertyValues = typedProperty.reduce(
      (acc: Record<string, string | number | string[]>, item) => {
        Object.entries(item).forEach(([key, values]) => {
          if (key === 'profitability') {
            acc[key] = values[0].id
          } else {
            acc[key] = values.map(v => v.value)
          }
        })

        return acc
      },
      {},
    )

    const updatedFormData = {
      ...otherData,
      ...propertyValues,
    }

    setFormData(updatedFormData)
  }

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

  const updatePicture = async (file: FormData) => {
    if (id === null) return

    const updateResponse = await postAddBusinessModelPicture(id, file)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully changed the picture of the Business Model',
        status: 'success',
      })
      getModelData()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const removePicture = async (data: { [key: string]: number }) => {
    if (id === null) return

    const updateResponse = await putRemoveBusinessModelPicture(id, data)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully deleted a picture from Business Model',
        status: 'success',
      })
      getModelData()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const handleEditNewBusinessModel = async () => {
    if (!formData || id === null) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { preview, content, ...updatedFormData } = formData

    const response = await putUpdateBusinessModel(id, updatedFormData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully changed the data from the Business Model',
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
    document.title = 'infiniti | Edit Business Model'
  }, [])

  useEffect(() => {
    getModelInputData()
    getModelData()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData && Object.keys(formData).length > 0 ? (
          <RecentCard
            title={t('admin-edit-business-model-page-title')}
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: `${t('admin-edit-business-model-page-button-1')}`,
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleEditNewBusinessModel,
            }}
          >
            <Fields
              inputData={inputData}
              formData={formData}
              setFormData={setFormData}
              updatePicture={updatePicture}
              removePicture={removePicture}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
