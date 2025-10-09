import { Fragment } from 'react/jsx-runtime'

import { Item } from './Item/Item'
import styles from './RecentMyOrders.module.scss'
import { ClientMyOrdersData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentMyOrdersProps {
  orders: ClientMyOrdersData[]
}

export const RecentMyOrders = ({ orders }: RecentMyOrdersProps) => {
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
              <Item data={order} />
              {index !== orders.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
