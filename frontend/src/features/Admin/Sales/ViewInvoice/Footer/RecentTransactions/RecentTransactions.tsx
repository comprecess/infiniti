import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'
import { SalesViewInvoiceTransactions } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../Main/RecentCard/Title/Title'

interface RecentTransactionsProps {
  transactionsList: SalesViewInvoiceTransactions[]
}

export const RecentTransactions = ({
  transactionsList,
}: RecentTransactionsProps) => {
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
            <Fragment key={index}>
              <Item data={item} />
              {index !== transactionsList.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
