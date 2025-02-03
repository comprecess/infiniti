import { useEffect } from 'react'

import { NewAccountFields } from '../../../../features/Admin/AccountingPage/NewAccount/NewAccountFields/NewAccountFields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewAccountPage.module.scss'

export const AdminNewAccountPage = () => {
  useEffect(() => {
    document.title = 'infiniti | New Account'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Add New Account'
          style={styles.recentFullScreen}
          Component={ButtonBlue}
          componentProps={{
            titleNone: true,
            title: 'Save',
            icon: '/icons/fileWhite.svg',
            iconProps: styles.buttonSaveIcon,
            style: styles.buttonSave,
          }}
        >
          <NewAccountFields />
        </RecentCard>
      </section>
    </div>
  )
}
