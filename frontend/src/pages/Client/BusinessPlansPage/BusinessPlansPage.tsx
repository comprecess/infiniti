import { useEffect, useState } from 'react'

import styles from './BusinessPlansPage.module.scss'
import { BusinessPlanItemData } from '../../../app/constants/constants'
import { CardPlan } from '../../../features/Client/BusinessPlan/CardPlan/CardPlan'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlansList } from '../../../shared/utils/api/Client/BusinessPlan/get-business-plans-list'

export const ClientBusinessPlansPage = () => {
  const [plansData, setPlansData] = useState<{
    data: BusinessPlanItemData[]
  } | null>(null)

  const getPlansData = async () => {
    const response = await getBusinessPlansList()

    if (!response.status) return

    setPlansData(response.data)
  }

  useEffect(() => {
    getPlansData()
  }, [])

  return (
    <>
      <div className={styles.title}>
        <TitlePage title='Business Plans' />
      </div>
      <div className={styles.wrapper}>
        {plansData ? (
          <section className={styles.section}>
            <div className={styles.plans}>
              {plansData.data.map(plan => {
                return (
                  <CardPlan
                    key={plan.id}
                    id={plan.id}
                    title={plan.companyName}
                    description={plan.exSummary}
                    picture={plan.file}
                    token={plan.publicToken}
                  />
                )
              })}
            </div>
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
    </>
  )
}
