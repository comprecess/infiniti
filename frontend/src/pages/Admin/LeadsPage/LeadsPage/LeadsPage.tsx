import styles from './LeadsPage.module.scss'
import { Filter } from '../../../../features/Admin/LeadsPage/Filter/Filter'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Search } from '../../../../shared/ui/Search/Search'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminLeadsPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <TitlePage title='Leads' />
          <ButtonBlue
            titleNone
            title='New Lead'
            icon='/icons/plus.svg'
            style={styles.buttonCreate}
            onClick={() => {}}
          />
        </div>
      </div>
      <section className={styles.sectionFirst}>
        <section className={styles.section}>
          <RecentCard title='Filter Leads' style={styles.cardFirst}>
            <Filter />
          </RecentCard>
          <RecentCard
            style={styles.cardSecond}
            title='View Leads'
            HeaderComponent={Search}
            headerProps={{ style: styles.search }}
          >
            Table
          </RecentCard>
        </section>
      </section>
    </div>
  )
}
