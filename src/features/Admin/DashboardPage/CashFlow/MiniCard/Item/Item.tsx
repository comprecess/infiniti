import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  plus?: boolean
  amount: string
}

export const Item: FC<ItemProps> = ({ amount, plus = false }) => {
  return (
    <div className={styles.wrapper}>
      {plus ? (
        <img
          className={styles.icon}
          src='/icons/creditCardPlus.svg'
          alt='CreditCardPlus'
        />
      ) : (
        <img
          className={styles.icon}
          src='/icons/creditCardOutcome.svg'
          alt='CreditCardOutcome'
        />
      )}
      <div className={styles.items}>
        <h5 className={styles.amount}>{amount}</h5>
        {plus ? (
          <span className={styles.nameItem}>Income</span>
        ) : (
          <span className={styles.nameItem}>Expense</span>
        )}
      </div>
    </div>
  )
}
