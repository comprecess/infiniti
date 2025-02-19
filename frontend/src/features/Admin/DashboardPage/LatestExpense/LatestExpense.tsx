import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './LatestExpense.module.scss'

const demoData = [
  {
    id: 0,
    date: '19.02.2025',
    amount: '1,020 $',
    description: 'Infiniti stream (2031)',
  },
  { id: 1, date: '19.02.2025', amount: '4,560 $', description: 'Menu' },
  { id: 2, date: '19.02.2025', amount: '870 $', description: 'Dedic64' },
  { id: 3, date: '19.02.2025', amount: '2,130 $', description: 'Zadarma' },
  {
    id: 4,
    date: '19.02.2025',
    amount: '1,240 $',
    description: 'Drumeneton',
  },
]

export const LatestExpense: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-7-table-1')}
          style={styles.dateColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-7-table-2')}
          style={styles.descriptionColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-7-table-3')}
          style={styles.amountColumn}
        />
      </div>
      <div className={styles.items}>
        {demoData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                date={order.date}
                amount={order.amount}
                description={order.description}
              />
              {index !== demoData.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
