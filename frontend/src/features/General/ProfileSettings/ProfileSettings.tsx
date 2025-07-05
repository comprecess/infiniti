import { NotificationCardData } from '../../../app/constants/constants'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { NotifDevicesCard } from './NotifDevicesCard/NotifDevicesCard'
import styles from './ProfileSettings.module.scss'

interface ProfileSettingsProps {
  listNotifications: NotificationCardData[]
  deleteNotification: (token: string) => void
}

export const ProfileSettings = ({
  listNotifications,
  deleteNotification,
}: ProfileSettingsProps) => {
  return (
    <RecentCard
      title='Profile Settings'
      style={styles.recentFullScreen}
      styleContent={styles.recentContent}
    >
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Push notifications</span>
        <div className={styles.content}>
          <div className={styles.list}>
            {listNotifications.map(item => (
              <NotifDevicesCard
                key={item.id}
                data={item}
                deleteNotification={deleteNotification}
              />
            ))}
          </div>
        </div>
      </div>
    </RecentCard>
  )
}
