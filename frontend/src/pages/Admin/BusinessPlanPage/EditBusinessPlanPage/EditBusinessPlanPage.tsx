import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { BusinessPlanNewPlanFormData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/GetBusinessPlanInfo'
import { putUpdateInfoBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/PutUpdateInfoBusinessPlan'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditBusinessPlanPage.module.scss'

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

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getInfoPlan = async () => {
    if (!id) return

    const response = await getBusinessPlanInfo(id)

    setFormData(response.data)
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
  }, [id])

  return (
    <div className={styles.wrapper}>
      {formData ? (
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
            <Fields formData={formData} setFormData={setFormData} />
          </RecentCard>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
