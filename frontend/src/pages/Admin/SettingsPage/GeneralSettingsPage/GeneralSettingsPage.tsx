import { SwitchNotifications } from '../../../../features/Admin/Settings/GeneralSettingsPage/SwitchNotifications/SwitchNotifications'
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
          <div className={styles.fields}>
            <SwitchNotifications />
          </div>
        </RecentCard>
      </section>
    </div>
  )
}
