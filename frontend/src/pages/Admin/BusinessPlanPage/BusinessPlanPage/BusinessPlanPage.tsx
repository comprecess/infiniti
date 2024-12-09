import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../app/router/routes'
import { CardPlan } from '../../../../features/Admin/BusinessPlanPage/BusinessPlanPage/CardPlan/CardPlan'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './BusinessPlanPage.module.scss'

export const AdminBusinessPlanPage: FC = () => {
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

  useEffect(() => {
    document.title = 'infiniti | Business Plans'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.wrapperButtonBlue}>
          <ButtonBlue
            title='Make Business Plan'
            style={styles.buttonBlue}
            onClick={handleNavigateToMakeBusinessPlan}
          />
        </div>
        <div className={styles.plans}>
          <CardPlan
            viewBusinessPlan={handleNavigateViewBusinessPlan}
            editBusinessPlan={handleNavigateEditBusinessPlan}
          />
          <CardPlan
            viewBusinessPlan={handleNavigateViewBusinessPlan}
            editBusinessPlan={handleNavigateEditBusinessPlan}
          />
          <CardPlan
            viewBusinessPlan={handleNavigateViewBusinessPlan}
            editBusinessPlan={handleNavigateEditBusinessPlan}
          />
        </div>
      </section>
    </div>
  )
}
