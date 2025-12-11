import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './ProfilePage.module.scss'
import { UserInfo } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { ProfileCard } from '../../../widgets/ProfileCard/ProfileCard'
import { ProfileChangeInfoCard } from '../../../widgets/ProfileChangeInfoCard/ProfileChangeInfoCard'

export const ClientProfilePage = () => {
  const { user, getUser } = useOutletContext<{ user: UserInfo; getUser: () => void }>()

  useEffect(() => {
    document.title = 'infiniti | Profile'
  }, [])

  return (
    <div className={styles.wrapper}>
      {user ? (
        <div className={styles.section}>
          <div className={styles.listItems}>
            <ProfileCard talent={user} onChangeInfo={getUser} />
            <ProfileChangeInfoCard talent={user} onChangeInfo={getUser} />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
