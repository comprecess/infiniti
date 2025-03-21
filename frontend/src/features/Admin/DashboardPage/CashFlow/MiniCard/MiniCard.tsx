import { Item } from './Item/Item'
import styles from './MiniCard.module.scss'

interface CardProps {
  title: string
  income: string
  expense: string
}

export const MiniCard = ({ title, income, expense }: CardProps) => {
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>{title}</h6>
      <div className={styles.items}>
        <Item plus amount={income} />
        <Item amount={expense} />
      </div>
    </div>
  )
}
