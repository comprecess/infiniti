import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/BusinessPlanPage/MakeBusinessPlanPage/Fields/Fields'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { postCreateNewBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/post-create-new-business-plan'
import { loadStorage } from '../../../../shared/utils/Saving/Storage/LoadStorage'
import { removeStorage } from '../../../../shared/utils/Saving/Storage/RemoveStorage'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { HeaderButtons } from './HeaderButtons/HeaderButtons'
import styles from './MakeBusinessPlanPage.module.scss'

export const AdminMakeBusinessPlanPage = () => {
  const storageKey = 'createBusinessPlanForm'

  const [formData, setFormData] = useState<PartialFieldsPostData>(
    () => loadStorage<PartialFieldsPostData>(storageKey) || {},
  )

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const handleCreateNewBusinessPlan = async () => {
    if (!formData) return

    const { status, message } = await postCreateNewBusinessPlan(formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Business Plan',
        status: 'success',
      })
      removeStorage(storageKey)
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.businessPlans}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Create Business Plan'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Create Plan'
          style={styles.recentFullScreen}
          Component={HeaderButtons}
          componentProps={{
            isClearButton: loadStorage(storageKey) ? true : false,
            storageKey,
            style: styles.buttonSave,
            iconProps: styles.buttonSaveIcon,
            onClick: handleCreateNewBusinessPlan,
          }}
        >
          <Fields
            formData={formData}
            setFormData={setFormData}
            storageKey={storageKey}
          />
        </RecentCard>
      </section>
    </div>
  )
}
