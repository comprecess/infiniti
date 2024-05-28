import { FC } from 'react'

import styles from './CurrentBalance.module.scss'

interface CurrentBalanceProps {
  currentBalance: string
}

export const CurrentBalance: FC<CurrentBalanceProps> = ({
  currentBalance,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Current balance</span>
      <h3 className={styles.currentBalance}>{currentBalance}</h3>
    </div>
  )
}
