import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  BusinessPlanItemData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { CardPlan } from '../../../../features/Admin/BusinessPlanPage/BusinessPlanPage/CardPlan/CardPlan'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/DeleteBusinessPlan'
import { getListBusinessPlans } from '../../../../shared/utils/api/Admin/BusinessPlan/GetListBusinessPlans'
import styles from './BusinessPlanPage.module.scss'

export const AdminBusinessPlanPage: FC = () => {
  const [plans, setPlans] = useState<BusinessPlanItemData[] | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const handleNavigateToMakeBusinessPlan = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.makeBusinessPlan}`,
    )
  }

  const handleNavigateViewBusinessPlan = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.view}/${Routes.businessPlan}/${id}`,
    )
  }

  const handleNavigateEditBusinessPlan = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.edit}/${Routes.businessPlan}/${id}`,
    )
  }

  const getPlansInfo = async () => {
    const response: { access: RolesAccess; data: BusinessPlanItemData[] } =
      await getListBusinessPlans()

    setPlans(response.data)
    setAccess(response.access)
  }

  const deletePlan = async (id: number) => {
    const response = await deleteBusinessPlan(id)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted your Business Plan',
        status: 'success',
      })
      getPlansInfo()
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getPlansInfo()

    document.title = 'infiniti | Business Plans'
  }, [])

  return (
    <div className={styles.wrapper}>
      {plans && access ? (
        <section className={styles.section}>
          {access.create === 1 && (
            <div className={styles.wrapperButtonBlue}>
              <ButtonBlue
                title='Make Business Plan'
                style={styles.buttonBlue}
                onClick={handleNavigateToMakeBusinessPlan}
              />
            </div>
          )}
          <div className={styles.plans}>
            {plans.map(plan => {
              return (
                <CardPlan
                  key={plan.id}
                  idCard={plan.id}
                  title={plan.companyName}
                  description={plan.exSummary}
                  viewBusinessPlan={handleNavigateViewBusinessPlan}
                  editBusinessPlan={handleNavigateEditBusinessPlan}
                  deleteBusinessPlan={deletePlan}
                  access={access}
                />
              )
            })}
          </div>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
