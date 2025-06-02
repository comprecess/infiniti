import { useState } from 'react'

import { AccountingTransactionsForm } from '../../../../../app/constants/constants'
import { Fields } from '../../../../../features/Admin/AccountingPage/ViewTransactions/EditTransaction/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditTransactionPage.module.scss'

export const AdminEditTransactionPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [form, _setForm] = useState<AccountingTransactionsForm | null>(null)

  return (
    <div className={styles.wrapper}>
      {!form ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit Transaction'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: () => {},
            }}
          >
            <Fields />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
