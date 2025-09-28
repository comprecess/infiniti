import styles from './Header.module.scss'
import { Chart } from '../Chart/Chart'

interface HeaderProps {
  netWorth: number
  netWorthCurrency: string
  limit: number
  limitCurrency: string
  name: string
}

export const Header = ({ netWorth, netWorthCurrency, limit, limitCurrency, name }: HeaderProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h3 className={styles.amount}>{netWorthCurrency}</h3>
        <span className={styles.name}>{name}</span>
      </div>
      <Chart
        netWorth={netWorth}
        netWorthCurrency={netWorthCurrency}
        limit={limit}
        limitCurrency={limitCurrency}
      />
    </div>
  )
}
