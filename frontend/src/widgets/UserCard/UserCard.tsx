import { FC } from 'react'

import { profileInfoString, UserInfo } from '../../app/constants/constants'
import { Avatar } from '../../features/Client/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Client/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { PersonInfo } from '../../features/Client/DashboardPage/ProfileCard/PersonInfo/PersonInfo'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { getSession } from '../../shared/utils/Saving/Session/GetSession'
import styles from './UserCard.module.scss'

export const UserCard: FC = () => {
  const profileData = getSession(profileInfoString) as UserInfo

  return (
    <div className={styles.wrapper}>
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
  )
}
