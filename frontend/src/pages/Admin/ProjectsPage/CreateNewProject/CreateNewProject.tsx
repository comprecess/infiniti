import { FC, useEffect } from 'react'

import { Fields } from '../../../../features/Admin/Projects/CreateNewProject/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CreateNewProject.module.scss'

export const AdminCreateNewProject: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Create Project'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Create New Project'
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
