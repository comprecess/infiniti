import React, { FC } from 'react'

import { ViewTransactionsTypeData } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'

interface RecentTransactionsProps {
  list: ViewTransactionsTypeData[]
}

export const RecentTransactions: FC<RecentTransactionsProps> = ({ list }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Type' style={styles.typeColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Dr.	' style={styles.drColumn} />
        <Title title='Cr.' style={styles.crColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                date={item.date}
                account={item.account}
                type={item.type}
                amount={item.amount}
                description={item.description}
                dr={item.dr}
                cr={item.cr}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
