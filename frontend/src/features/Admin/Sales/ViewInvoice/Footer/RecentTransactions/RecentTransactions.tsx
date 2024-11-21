import React, { FC } from 'react'

import { SalesViewInvoiceTransactions } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'

interface RecentTransactionsProps {
  transactionsList: SalesViewInvoiceTransactions[]
}

export const RecentTransactions: FC<RecentTransactionsProps> = ({
  transactionsList,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
      </div>
      <div className={styles.items}>
        {transactionsList.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <Item data={item} />
              {index !== transactionsList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
