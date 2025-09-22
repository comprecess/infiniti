import styles from './Header.module.scss'
import { Chart } from '../Chart/Chart'

interface HeaderProps {
  amount: string
  total: string
  name: string
}

export const Header = ({ amount, total, name }: HeaderProps) => {
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
