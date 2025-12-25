import { useNavigate } from 'react-router-dom'

import styles from './UserCard.module.scss'
import { UserInfo } from '../../app/constants/constants'
import { Routes } from '../../app/router/routes'
import { Avatar } from '../../features/Client/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Client/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { EditPencilFill } from '../../shared/icons/EditPencilFill'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'

interface UserCardProps {
  profileData: UserInfo
  handleOpenCloseAddFund: () => void
}

export const UserCard = ({ profileData, handleOpenCloseAddFund }: UserCardProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.header}>
          <Avatar avatar={profileData.img} name={profileData.account} />
          <div
            className={styles.edit}
            onClick={() => navigate(`/${Routes.clientPages}/${Routes.profile}`)}
          >
            <EditPencilFill />
          </div>
        </div>
        <CurrentBalance currentBalance={profileData.balance} />
        <ButtonBlue
          title='Add Fund'
          variant='outline'
          style={styles.button}
          onClick={handleOpenCloseAddFund}
        />
        {/* <PersonInfo
          personalNumber={profileData.phone}
          email={profileData.email}
          businessNumber={profileData.businessNumber}
          company={profileData.company}
          city={profileData.city}
          zipCode={profileData.zip}
          stateRegion={profileData.state}
          country={profileData.country}
        /> */}
      </div>
    </div>
  )
}
