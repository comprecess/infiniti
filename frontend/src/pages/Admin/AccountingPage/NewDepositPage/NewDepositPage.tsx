import { useEffect } from 'react'

import { AddDepositFields } from '../../../../features/Admin/AccountingPage/NewDepositPage/AddDepositFields/AddDepositFields'
import { RecentDeposits } from '../../../../features/Admin/AccountingPage/NewDepositPage/RecentDeposits/RecentDeposits'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewDepositPage.module.scss'

export const AdminNewDepositPage = () => {
  useEffect(() => {
    document.title = 'infiniti | New Deposit'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard style={styles.cardFirst} title='Add Deposit'>
          <AddDepositFields />
        </RecentCard>
        <RecentCard style={styles.cardSecond} title='Recent Deposits'>
          <RecentDeposits />
        </RecentCard>
      </section>
    </div>
  )
}
