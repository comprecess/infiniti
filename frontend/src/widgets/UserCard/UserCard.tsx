import styles from './UserCard.module.scss'
import { UserInfo } from '../../app/constants/constants'
import { Avatar } from '../../features/Client/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Client/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { PersonInfo } from '../../features/Client/DashboardPage/ProfileCard/PersonInfo/PersonInfo'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'

interface UserCardProps {
  profileData: UserInfo
  handleOpenCloseAddFund: () => void
}

export const UserCard = ({ profileData, handleOpenCloseAddFund }: UserCardProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <Avatar avatar={profileData.img} name={profileData.account} />
        <CurrentBalance currentBalance={profileData.balance} />
        <ButtonBlue title='Add Fund' onClick={handleOpenCloseAddFund} />
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
    </div>
  )
}
