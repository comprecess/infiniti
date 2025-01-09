import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BusinessModelInputData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/BusinessPlanPage/MakeBusinessModel/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInputData } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetInputData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './MakeBusinessModelPage.module.scss'

export const AdminMakeBusinessModelPage = () => {
  const [inputData, setInputData] =
    useState<BusinessModelInputData | null>(null)

  const { t } = useTranslation()

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

  useEffect(() => {
    getModelInputData()

    document.title = 'infiniti | Make Business Model'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title={t('admin-make-business-plan-page-title')}
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: `${t('admin-make-business-plan-page-button-1')}`,
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
            }}
          >
            <Fields inputData={inputData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
