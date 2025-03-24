import { useEffect } from 'react'

import { Fields } from '../../../../features/Admin/Projects/EditProject/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditProject.module.scss'

export const AdminEditProject = () => {
  useEffect(() => {
    document.title = 'infiniti | Edit Project'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Edit Project'
          Component={ButtonBlue}
          style={styles.recentFullScreen}
          componentProps={{
            titleNone: true,
            title: 'Save',
            icon: '/icons/fileWhite.svg',
            iconProps: styles.buttonSaveIcon,
            style: styles.buttonSave,
          }}
        >
          <Fields />
        </RecentCard>
      </section>
    </div>
  )
}
