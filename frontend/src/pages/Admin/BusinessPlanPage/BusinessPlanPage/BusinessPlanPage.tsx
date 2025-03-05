import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const showToast = useCustomToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const { data: plansData } = useQuery({
    queryKey: ['businessPlans'],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: BusinessPlanItemData[]
      } = await getListBusinessPlans()

      return response
    },
    placeholderData: previousData => previousData,
  })

  const deletePlan = async (id: number) => {
    const response = await deleteBusinessPlan(id)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted your Business Plan',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['businessPlans'] })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Business Plans'
  }, [])

  return (
    <div className={styles.wrapper}>
      {plansData ? (
        <section className={styles.section}>
          {plansData.access.create === 1 && (
            <div className={styles.wrapperButtonBlue}>
              <ButtonBlue
                title={t('admin-business-plans-page-button-1')}
                style={styles.buttonBlue}
                onClick={handleNavigateToMakeBusinessPlan}
              />
            </div>
          )}
          <div className={styles.plans}>
            {plansData.data.map(plan => {
              return (
                <CardPlan
                  key={plan.id}
                  idCard={plan.id}
                  title={plan.companyName}
                  description={plan.exSummary}
                  viewBusinessPlan={handleNavigateViewBusinessPlan}
                  editBusinessPlan={handleNavigateEditBusinessPlan}
                  deleteBusinessPlan={deletePlan}
                  access={plansData.access}
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
