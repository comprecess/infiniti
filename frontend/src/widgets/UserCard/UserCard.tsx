import { useCallback, useEffect, useState } from 'react'

import { UserInfo } from '../../app/constants/constants'
import { Avatar } from '../../features/Client/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Client/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { PersonInfo } from '../../features/Client/DashboardPage/ProfileCard/PersonInfo/PersonInfo'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProfileInfo } from '../../shared/utils/api/get-profile-info'
import styles from './UserCard.module.scss'

export const UserCard = () => {
  const [profileData, setProfileData] = useState<UserInfo | null>(null)

  const getProfileData = useCallback(async () => {
    const response = await getProfileInfo()

    if (!response.status) return

    setProfileData(response.data)
  }, [])

  useEffect(() => {
    getProfileData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {profileData ? (
        <div className={styles.items}>
          <Avatar avatar={profileData.img} name={profileData.account} />
          <CurrentBalance currentBalance={profileData.balance} />
          <ButtonBlue title='Add fund' />
          <PersonInfo
            personalNumber={profileData.phone}
            email={profileData.email}
            businessNumber={profileData.businessNumber}
            company={profileData.company}
            city={profileData.city}
            zipCode={profileData.zip}
            stateRegion={profileData.state}
            country={profileData.country}
          />
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
