import { useEffect, useState } from 'react'

import styles from './BusinessPlansPage.module.scss'
import { BusinessPlanItemData } from '../../../app/constants/constants'
import { CardPlan } from '../../../features/Client/BusinessPlan/CardPlan/CardPlan'
import { CardPlanError } from '../../../features/Client/BusinessPlan/CardPlanError/CardPlanError'
import { CardPlanLoading } from '../../../features/Client/BusinessPlan/CardPlanLoading/CardPlanLoading'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlansList } from '../../../shared/utils/api/Client/BusinessPlan/get-business-plans-list'
import { useAppWebSocket } from '../../../shared/utils/providers/WebSocketProvider'

export const ClientBusinessPlansPage = () => {
  const [plansData, setPlansData] = useState<{
    data: BusinessPlanItemData[]
  } | null>(null)

  const { isConnected, isAuth, on } = useAppWebSocket()

  const getPlansData = async () => {
    const response = await getBusinessPlansList()

    if (!response.status) return

    setPlansData(response.data)
  }

  useEffect(() => {
    getPlansData()
  }, [])

  // Refresh when user returns to the tab — plan may have finished in background
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') getPlansData()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    if (!isConnected || !isAuth) return

    on('business-plan-list', getPlansData)

    return () => {
      on('business-plan-list', () => {})
    }
  }, [isConnected, isAuth, on])

  return (
    <>
      <div className={styles.title}>
        <TitlePage title='Business Plans' />
      </div>
      <div className={styles.wrapper}>
        {plansData ? (
          <section className={styles.section}>
            {plansData.data.length > 0 ? (
              <div className={styles.plans}>
                {plansData.data.map(plan => {
                  if (plan.status === 'Processing' || plan.status === 'New') {
                    return <CardPlanLoading key={plan.id} planId={plan.id} onRefresh={getPlansData} />
                  }

                  if (plan.status === 'Error') {
                    return <CardPlanError key={plan.id} />
                  }

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
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )}
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
    </>
  )
}
