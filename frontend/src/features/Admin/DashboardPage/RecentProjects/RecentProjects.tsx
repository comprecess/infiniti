import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentProjects.module.scss'

const demoData = [
  {
    id: 0,
    avatar: '/cartAvatar.svg',
    name: 'Marketing & Sales Strategy',
    budget: '1,020 $',
    status: 'Started',
    created: '19.02.2025',
  },
  {
    id: 1,
    avatar: '/cartAvatar.svg',
    name: 'Dhaba.com — SEO',
    budget: '4,560 $',
    status: 'Started',
    created: '19.02.2025',
  },
  {
    id: 2,
    avatar: '/cartAvatar.svg',
    name: 'DMSoftware — SEO',
    budget: '870 $',
    status: 'Paused',
    created: '19.02.2025',
  },
  {
    id: 3,
    avatar: '/cartAvatar.svg',
    name: 'QTECH — Website programming',
    budget: '2,130 $',
    status: 'Paused',
    created: '19.02.2025',
  },
  {
    id: 4,
    avatar: '/cartAvatar.svg',
    name: 'Metromarkt — BA & Copywriting',
    budget: '1,240 $',
    status: 'Completed',
    created: '19.02.2025',
  },
]

export const RecentProjects: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-3-table-1')}
          style={styles.nameColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-2')}
          style={styles.budgetColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-3')}
          style={styles.statusColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-4')}
          style={styles.createdColumn}
        />
      </div>
      <div className={styles.items}>
        {demoData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                name={order.name}
                budget={order.budget}
                status={order.status}
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
