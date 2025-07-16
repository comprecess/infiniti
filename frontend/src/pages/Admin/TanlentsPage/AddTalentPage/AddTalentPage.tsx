import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  TalentFormData,
  TalentsInputData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Fields } from '../../../../features/Admin/TalentsPage/AddTalentPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { postAddTalent } from '../../../../shared/utils/api/Admin/Talents/AddTalent/PostAddTalent'
import { getTalentsInputData } from '../../../../shared/utils/api/Admin/Talents/GetTalentsInputData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AddTalentPage.module.scss'

export const AdminAddTalentPage = () => {
  const [formData, setFormData] = useState<Partial<TalentFormData>>({})
  const [inputData, setInputData] = useState<TalentsInputData | null>(null)

  const { t } = useTranslation()

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInputData = async () => {
    const getResponse = await getTalentsInputData()

    const { allSkills, industries, keySkills, ...otherData } = getResponse

    const updatedResponse = {
      allSkills: allSkills.map((skill: any) => ({
        value: skill.value.replace(/&amp;/g, '&'),
      })),
      industries: industries.map((industry: any) => ({
        value: industry.value.replace(/&amp;/g, '&'),
      })),
      keySkills: keySkills.map((keySkill: any) => ({
        value: keySkill.value.replace(/&amp;/g, '&'),
      })),
      ...otherData,
    }

    setInputData(updatedResponse)
  }

  const createNewTalent = async () => {
    if (!formData) return

    const createResponse = await postAddTalent(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Talent',
        status: 'success',
      })
      navigate(`/${Routes.adminPages}/${Routes.talents}/${Routes.catalog}`)
    } else {
      showToast({
        title: 'Error',
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Add Talent'
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title={t('admin-talents-add-talent-page-title')}
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: `${t('admin-talents-add-talent-page-button-1')}`,
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: createNewTalent,
              style: styles.buttonSave,
            }}
          >
            <Fields inputData={inputData} onFormDataChange={setFormData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
