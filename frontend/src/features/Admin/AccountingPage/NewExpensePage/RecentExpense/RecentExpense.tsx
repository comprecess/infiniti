import { Fragment } from 'react'

import { AccountingTransactions } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentExpense.module.scss'

interface RecentExpenseProps {
  transactions: AccountingTransactions[]
}

export const RecentExpense = ({ transactions }: RecentExpenseProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Amount' style={styles.amountColumn} />
      </div>
      <div className={styles.items}>
        {transactions.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item transaction={item} />
              {index !== transactions.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
