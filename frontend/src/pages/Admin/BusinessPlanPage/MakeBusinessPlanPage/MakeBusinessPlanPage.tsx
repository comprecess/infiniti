import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/BusinessPlanPage/MakeBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { newBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/NewBusinessPlan'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './MakeBusinessPlanPage.module.scss'

export const AdminMakeBusinessPlanPage = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const handleCreateNewBusinessPlan = async () => {
    if (!formData) return

    const response = await newBusinessPlan(formData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Business Plan',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.businessPlans}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Make Business Plan'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Make Business Plan'
          style={styles.recentFullScreen}
          Component={ButtonBlue}
          componentProps={{
            titleNone: true,
            title: 'Save',
            style: styles.buttonSave,
            iconProps: styles.buttonSaveIcon,
            icon: '/icons/fileWhite.svg',
            onClick: handleCreateNewBusinessPlan,
          }}
        >
          <Fields formData={formData} setFormData={setFormData} />
        </RecentCard>
      </section>
    </div>
  )
}
