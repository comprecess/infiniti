import styleItem from '../NetWorthAccountBalances.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  account: string
  balance: string
}

export const Item = ({ account, balance }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span className={`${styleItem.balanceColumn} ${styles.balanceItem}`}>
        {balance}
      </span>
    </div>
  )
}
