import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentClients.module.scss'

const demoData = [
  {
    id: 0,
    avatar: '/cartAvatar.svg',
    name: 'Alex Vishnyakov',
    email: 'alex.v1984@gmail.com',
    created: '19.02.2025',
  },
  {
    id: 1,
    avatar: '/cartAvatar.svg',
    name: 'Alex Vishnyakov',
    email: 'alex.v1984@gmail.com',
    created: '19.02.2025',
  },
  {
    id: 2,
    avatar: '/cartAvatar.svg',
    name: 'Alex Vishnyakov',
    email: 'alex.v1984@gmail.com',
    created: '19.02.2025',
  },
  {
    id: 3,
    avatar: '/cartAvatar.svg',
    name: 'Alex Vishnyakov',
    email: 'alex.v1984@gmail.com',
    created: '19.02.2025',
  },
]

export const RecentClients: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-2-table-1')}
          style={styles.avatarColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-2-table-2')}
          style={styles.nameEmailColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-2-table-3')}
          style={styles.createdColumn}
        />
      </div>
      <div className={styles.items}>
        {demoData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                avatar={order.avatar}
                name={order.name}
                email={order.email}
                created={order.created}
              />
              {index !== demoData.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
