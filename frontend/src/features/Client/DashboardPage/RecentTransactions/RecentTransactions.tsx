import React, { FC } from 'react'

import { RecentTransactionsData } from '../../../../app/data/client/recentTransactions'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'

export const RecentTransactions: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
      </div>
      <div className={styles.items}>
        {RecentTransactionsData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                date={order.date}
                account={order.account}
                amount={order.amount}
                description={order.description}
              />
              {index !== RecentTransactionsData.length - 1 && (
                <CustomDivider />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
