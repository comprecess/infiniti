import { Fragment } from 'react/jsx-runtime'

import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'
import { ClientTransactionsData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentTransactionsProps {
  transactions: ClientTransactionsData[]
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
      </div>
      <div className={styles.items}>
        {transactions.map((transaction, index) => {
          return (
            <Fragment key={`${transaction.account}-index`}>
              <Item data={transaction} />
              {index !== transactions.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
