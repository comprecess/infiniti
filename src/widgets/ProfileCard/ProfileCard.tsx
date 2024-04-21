import { FC } from 'react'

import { Avatar } from '../../features/Admin/DashboardPage/ProfileCard/Avatar/Avatar'
import { CurrentBalance } from '../../features/Admin/DashboardPage/ProfileCard/CurrentBalance/CurrentBalance'
import { PersonInfo } from '../../features/Admin/DashboardPage/ProfileCard/PersonInfo/PersonInfo'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './ProfileCard.module.scss'

export const ProfileCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Avatar />
      <CurrentBalance />
      <ButtonBlue title='Add fund' />
      <PersonInfo />
    </div>
  )
}
