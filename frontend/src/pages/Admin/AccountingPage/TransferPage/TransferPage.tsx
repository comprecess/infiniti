import { useEffect } from 'react'

import { NewTransferFields } from '../../../../features/Admin/AccountingPage/TransferPage/NewTransferFields/NewTransferFields'
import { RecentTransfers } from '../../../../features/Admin/AccountingPage/TransferPage/RecentTransfers/RecentTransfers'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './TransferPage.module.scss'

export const AdminTransferPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Transfer'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard style={styles.cardFirst} title='New Transfer'>
          <NewTransferFields />
        </RecentCard>
        <RecentCard style={styles.cardSecond} title='Recent Transfers'>
          <RecentTransfers />
        </RecentCard>
      </section>
    </div>
  )
}
