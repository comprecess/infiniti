import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Chart } from './Chart/Chart'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

const demoData = [
  {
    id: 0,
    hashtag: 'INV-091820',
    account: 'Konstantin Rabits',
    amount: '4,560 $',
    created: '19.02.2025',
    due: '19.02.2025',
    status: 'Unpaid',
  },
  {
    id: 1,
    hashtag: 'INV-091820',
    account: 'Konstantin Rabits',
    amount: '4,560 $',
    created: '19.02.2025',
    due: '19.02.2025',
    status: 'Partially Paid',
  },
  {
    id: 2,
    hashtag: 'INV-091820',
    account: 'Konstantin Rabits',
    amount: '4,560 $',
    created: '19.02.2025',
    due: '19.02.2025',
    status: 'Partially Paid',
  },
  {
    id: 3,
    hashtag: 'INV-091820',
    account: 'Konstantin Rabits',
    amount: '4,560 $',
    created: '19.02.2025',
    due: '19.02.2025',
    status: 'Partially Paid',
  },
  {
    id: 4,
    hashtag: 'INV-091820',
    account: 'Konstantin Rabits',
    amount: '1,020 $',
    created: '19.02.2025',
    due: '19.02.2025',
    status: 'Paid',
  },
]

export const RecentInvoices: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div>
          <div className={styles.columns}>
            <Title title='#' style={styles.hashtagColumn} />
            <Title
              title={t('admin-dashboard-page-card-4-table-1')}
              style={styles.accountColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-2')}
              style={styles.amountColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-3')}
              style={styles.createdColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-4')}
              style={styles.dueColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-5')}
              style={styles.statusColumn}
            />
          </div>
          <div className={styles.items}>
            {demoData.map((order, index) => {
              return (
                <React.Fragment key={order.id}>
                  <Item
                    hashtag={order.hashtag}
                    account={order.account}
                    amount={order.amount}
                    created={order.created}
                    due={order.due}
                    status={order.status}
                  />
                  {index !== demoData.length - 1 && <CustomDivider />}
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <Chart data={demoData.map(item => item.status)} />
      </div>
    </div>
  )
}
