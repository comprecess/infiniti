import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { RecentOrdersData } from '../../../../app/data/recentOrders'
import { Title } from '../RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOrders.module.scss'

export const RecentOrders: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Order #' style={styles.orderColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Status' style={styles.statusColumn} />
      </div>
      <div className={styles.items}>
        {RecentOrdersData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                date={order.date}
                order={order.order}
                amount={order.amount}
                status={order.status}
              />
              {index !== RecentOrdersData.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
