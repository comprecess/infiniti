import { useEffect } from 'react'

import { Fields } from '../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditBusinessPlanPage.module.scss'

export const AdminEditBusinessPlanPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Edit Business Plan'
  }, [])

  return (
    <div className={styles.wrapper}>
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
          }}
        >
          <Fields />
        </RecentCard>
      </section>
    </div>
  )
}
