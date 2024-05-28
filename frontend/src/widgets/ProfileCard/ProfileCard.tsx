import { FC } from 'react'

import {
  ProfileInfo,
  profileInfoString,
} from '../../app/constants/constants'
import { Avatar } from '../../features/Client/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Client/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { PersonInfo } from '../../features/Client/DashboardPage/ProfileCard/PersonInfo/PersonInfo'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { getSession } from '../../shared/utils/Saving/Session/GetSession'
import styles from './ProfileCard.module.scss'

export const ProfileCard: FC = () => {
  const profileData = getSession(profileInfoString) as ProfileInfo

  return (
    <div className={styles.wrapper}>
      <Avatar avatar={profileData.img} name={profileData.account} />
      <CurrentBalance currentBalance={profileData.balance} />
      <ButtonBlue title='Add fund' />
      <PersonInfo
        personalNumber={profileData.phone}
        email={profileData.email}
        businessNumber={profileData.business_number}
        company={profileData.company}
        city={profileData.city}
        zipCode={profileData.zip}
        stateRegion={profileData.state}
        country={profileData.country}
      />
    </div>
  )
}
