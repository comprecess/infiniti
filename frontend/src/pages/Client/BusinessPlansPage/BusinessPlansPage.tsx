import { useState } from 'react'

import { BusinessPlanItemData } from '../../../app/constants/constants'
import { CardPlan } from '../../../features/Client/BusinessPlan/CardPlan/CardPlan'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import styles from './BusinessPlansPage.module.scss'

export const ClientBusinessPlansPage = () => {
  const [plansData] = useState<{
    data: BusinessPlanItemData[]
  } | null>(null)

  return (
    <div className={styles.wrapper}>
      {plansData ? (
        <section className={styles.section}>
          <div className={styles.plans}>
            {plansData.data.map(plan => {
              return (
                <CardPlan
                  key={plan.id}
                  title={plan.companyName}
                  description={plan.exSummary}
                  picture={plan.file}
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
