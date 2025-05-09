import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './GeneralSettingsPage.module.scss'

export const AdminGeneralSettingsPage = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          style={styles.recentFullScreen}
          title='General Settings'
        >
          <div className={styles.fields}>Content</div>
        </RecentCard>
      </section>
    </div>
  )
}
