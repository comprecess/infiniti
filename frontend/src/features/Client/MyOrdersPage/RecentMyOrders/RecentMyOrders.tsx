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
      {orders.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title title='Date' style={styles.dateColumn} />
            <Title title='Type' style={styles.typeColumn} />
            <Title title='Number Talents' style={styles.countColumn} />
            <Title title='Amount' style={styles.amountColumn} />
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
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
