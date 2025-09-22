import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'
import { AccountingTransactionsData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentTransactionsProps {
  transactions: AccountingTransactionsData[]
}

export const RecentTransactions = ({
  transactions,
}: RecentTransactionsProps) => {
  return (
    <div className={styles.wrapper}>
      {transactions.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title title='Date' style={styles.dateColumn} />
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Amount' style={styles.amountColumn} />
            <Title title='Description' style={styles.descriptionColumn} />
          </div>
          <div className={styles.items}>
            {transactions.map((transaction, index) => {
              return (
                <Fragment key={transaction.id}>
                  <Item
                    date={transaction.date}
                    account={transaction.account}
                    amount={transaction.amount}
                    description={transaction.description}
                  />
                  {index !== transactions.length - 1 && <CustomDivider />}
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
