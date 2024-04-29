import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { LatestIncomeData } from '../../../../app/data/latestIncome'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './LatestIncome.module.scss'

export const LatestIncome: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Amount' style={styles.amountColumn} />
      </div>
      <div className={styles.items}>
        {LatestIncomeData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                date={order.date}
                amount={order.amount}
                description={order.description}
              />
              {index !== LatestIncomeData.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
