import { ProfileSettings } from '../../../features/General/ProfileSettings/ProfileSettings'
import styles from './ProfileSettingsPage.module.scss'

export const ClientProfileSettingsPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <ProfileSettings />
      </div>
    </div>
  )
}
