import { FC } from 'react'

import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './CardPlan.module.scss'

interface CardPlanProps {
  viewBusinessPlan: (id: number) => void
  editBusinessPlan: (id: number) => void
}

export const CardPlan: FC<CardPlanProps> = ({
  viewBusinessPlan,
  editBusinessPlan,
}) => {
  const handleNavigateViewBusinessPlan = () => {
    viewBusinessPlan(1)
  }

  const handleNavigateEditBusinessPlan = () => {
    editBusinessPlan(1)
  }

  return (
    <RecentCard style={styles.recentCard}>
      <div className={styles.wrapper}>
        <img src='/bp.jpeg' alt='Logo' className={styles.logo} />
        <div className={styles.content}>
          <div className={styles.texts}>
            <span className={styles.title}>Title</span>
            <span className={styles.description}>Description</span>
          </div>
          <div className={styles.miniButtons}>
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={handleNavigateViewBusinessPlan}
            />
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateEditBusinessPlan}
            />
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </RecentCard>
  )
}
