import { FC } from 'react'

import { Chart } from '../Chart/Chart'
import styles from './Header.module.scss'

interface HeaderProps {
  amount: string
  total: string
  name: string
}

export const Header: FC<HeaderProps> = ({ amount, total, name }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h3 className={styles.amount}>{amount}</h3>
        <span className={styles.name}>{name}</span>
      </div>
      <Chart amount={amount} total={total} />
    </div>
  )
}
