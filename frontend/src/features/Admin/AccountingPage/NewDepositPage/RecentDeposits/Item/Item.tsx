import styles from './Item.module.scss'
import { AccountingTransactions } from '../../../../../../app/constants/constants'
import styleItem from '../RecentDeposits.module.scss'

interface ItemProps {
  transaction: AccountingTransactions
}

export const Item = ({ transaction }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {transaction.account}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {transaction.description}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {transaction.amount}
      </span>
    </div>
  )
}
