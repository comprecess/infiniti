import { FC, useEffect, useState } from 'react'

import { Fields } from '../../../../features/Admin/Sales/EditOffer/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditOfferPage.module.scss'

export const AdminEditOfferPage: FC = () => {
  const [_formData, _setFormData] = useState<Partial<[]>>([])
  const [inputData, _setInputData] = useState<[] | null>(null)

  useEffect(() => {
    document.title = 'infiniti | Edit Offer'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {!inputData ? (
          <RecentCard
            title='Edit Offer'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
            }}
          >
            <Fields />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
