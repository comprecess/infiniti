import { FC, useEffect, useState } from 'react'

import { Fields } from '../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewOfferPage.module.scss'

export const AdminNewOfferPage: FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_formData, _setFormData] = useState<Partial<[]>>([])
  const [inputData, _setInputData] = useState<[] | null>(null)

  useEffect(() => {
    document.title = 'infiniti | New Offer'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {!inputData ? (
          <RecentCard
            title='Create New Offer'
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
