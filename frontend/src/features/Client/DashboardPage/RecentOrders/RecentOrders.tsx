import { Fragment } from 'react'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOrders.module.scss'

export const RecentOrders = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Order #' style={styles.orderColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Status' style={styles.statusColumn} />
      </div>
      <div className={styles.items}>
        {[].map((_order, index) => {
          return (
            <Fragment key={'order.id'}>
              <Item
                date={'order.date'}
                order={'order.order'}
                amount={'order.amount'}
                status={'order.status'}
              />
              {index !== [].length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
