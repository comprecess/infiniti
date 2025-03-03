import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import {
  BusinessModelInputData,
  ValuesProps,
} from '../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/BusinessPlanPage/EditBusinessModel/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getEditModelInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetEditModelInfo'
import { getInputData } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetInputData'
import { putAddBusinessModelPicture } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/PutAddBusinessModelPicture'
import { putUpdateModelInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/PutUpdateModelInfo'
import { removePictureBusinessModel } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/RemovePictureBusinessModel'
import { getChatGPTAnalysis } from '../../../../shared/utils/api/Admin/ChatGPT/GetChatGPTAnalysis'
import { useChatGPT } from '../../../../shared/utils/Contexts/ChatGPTContext'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditBusinessModel.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/business-model\/(\d+)$/
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

export const AdminEditBusinessModel = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})
  const [inputData, setInputData] =
    useState<BusinessModelInputData | null>(null)

  const { t } = useTranslation()
  const { chatGPTChangeForm, setChatGPTChangeForm } = useChatGPT()

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getModelData = async () => {
    if (id === null) return

    const response = await getEditModelInfo(id)

    const { property, ...otherData } = response.data

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
    const response = await getInputData()

    const { industries, technologies, ...otherData } = response

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

    const updateResponse = await putAddBusinessModelPicture(id, file)

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

    const updateResponse = await removePictureBusinessModel(id, data)

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

    const response = await putUpdateModelInfo(id, updatedFormData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully changed the data from the Business Model',
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
      '?discussionModel=businessModel',
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
