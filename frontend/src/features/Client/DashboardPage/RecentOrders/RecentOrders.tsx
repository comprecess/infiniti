import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentOrders.module.scss'
import { OrdersViewCompany } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentOrdersProps {
  orders: OrdersViewCompany[]
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  if (orders.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Order #' style={styles.orderColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Status' style={styles.statusColumn} />
      </div>
      <div className={styles.items}>
        {orders.map((order, index) => {
          return (
            <Fragment key={order.id}>
              <Item
                date={order.dateAdded}
                order={order.orderNum}
                amount={order.amount}
                status={order.status}
              />
              {index !== orders.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
