import { FC, useEffect } from 'react'

import { Fields } from '../../../../features/Admin/BusinessPlanPage/MakeBusinessPlanPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './MakeBusinessPlanPage.module.scss'

export const AdminMakeBusinessPlanPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Make Business Plan'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Make Business Plan'
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
