import { Fragment } from 'react'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOrders.module.scss'

interface RecentOrdersProps {
  orders: []
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  return (
    <div className={styles.wrapper}>
      {orders.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title title='Date' style={styles.dateColumn} />
            <Title title='Order #' style={styles.orderColumn} />
            <Title title='Amount' style={styles.amountColumn} />
            <Title title='Status' style={styles.statusColumn} />
          </div>
          <div className={styles.items}>
            {orders.map((_order, index) => {
              return (
                <Fragment key={'order.id'}>
                  <Item
                    date={'order.date'}
                    order={'order.order'}
                    amount={'order.amount'}
                    status={'order.status'}
                  />
                  {index !== orders.length - 1 && <CustomDivider />}
                </Fragment>
              )
            })}
          </div>
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
