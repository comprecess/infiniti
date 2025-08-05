import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import styleItem from '../RecentClients.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  clientId: number
  avatar: string
  name: string
  email: string
  created: string
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({
  clientId,
  avatar,
  name,
  email,
  created,
  roles,
}: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToClient = () => {
    if (roles && roles.customers.view === 0) {
      navigate(`/403`)
    } else {
      navigate(
        `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${clientId}/${Routes.summary}`,
      )
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <img src={avatar} alt='Avatar' className={styles.avatarItem} />
      </div>
      <div
        className={`${styleItem.nameEmailColumn} ${styles.items}`}
        onClick={handleNavigateToClient}
      >
        <span className={styles.nameItem}>{name}</span>
        <span className={styles.emailItem} contentEditable={false}>
          {email}
        </span>
      </div>
      <span className={`${styleItem.createdColumn} ${styles.createdItem}`}>
        {created}
      </span>
    </div>
  )
}
