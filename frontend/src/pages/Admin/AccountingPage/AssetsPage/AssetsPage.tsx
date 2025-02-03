import { useEffect } from 'react'

import { Assets } from '../../../../features/Admin/AccountingPage/AssetsPage/Assets/Assets'
import { AssetsTable } from '../../../../features/Admin/AccountingPage/AssetsPage/AssetsTable/AssetsTable'
import { SearchAndButtons } from '../../../../features/Admin/Sales/OffersPage/SearchAndButtons/SearchAndButtons'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AssetsPage.module.scss'

export const AdminAssetsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Assets'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard style={styles.cardFirst} title='Assets'>
          <Assets />
        </RecentCard>
        <RecentCard
          style={styles.cardSecond}
          title='Total: 0'
          HeaderComponent={SearchAndButtons}
          headerProps={{
            searchChange: () => {},
            rightButtons: () => {},
          }}
        >
          <AssetsTable />
        </RecentCard>
      </section>
    </div>
  )
}
