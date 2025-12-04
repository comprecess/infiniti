import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ResponsiveRow } from '../../../../../shared/ui/ExpandableRow/ResponsiveRow'
import styleItem from '../RecentClients.module.scss'

interface ItemProps {
  clientId: number
  avatar: string
  name: string
  email: string
  created: string
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({ clientId, avatar, name, email, created, roles }: ItemProps) => {
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
    <ResponsiveRow
      hiddenFields={[
        {
          label: 'Email:',
          value: <span className={styles.emailItemMobile}>{email}</span>,
        },
        {
          label: 'Created:',
          value: <span className={styles.createdItemMobile}>{created}</span>,
        },
      ]}
      visibleFields={[
        {
          label: 'Avatar',
          value: <img src={avatar} className={styles.avatarItem} />,
          className: styleItem.avatarColumn,
          onClick: handleNavigateToClient,
        },
        {
          label: 'Name',
          value: (
            <div className={styles.items}>
              <span className={styles.nameItem}>{name}</span>
              <span className={styles.emailItem}>{email}</span>
            </div>
          ),
          className: styleItem.nameEmailColumn,
          onClick: handleNavigateToClient,
        },
        {
          label: 'Created',
          value: <span className={styles.createdItem}>{created}</span>,
          className: styleItem.createdColumn,
        },
      ]}
    />
  )
}
