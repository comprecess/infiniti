import styles from './BigCard.module.scss'
import { ChevronDownIcon } from '../../../../../shared/icons/ChevronDownIcon'

interface BigCardProps {
  icon: string
  amount: string
  title: string
  style?: string
  onClick: () => void
}

export const BigCard = ({ icon, amount, title, style, onClick }: BigCardProps) => {
  return (
    <div className={`${styles.wrapper} ${style}`} onClick={onClick}>
      <img src={icon} alt='Icon' className={styles.icon} />
      <div className={styles.items}>
        <h3 className={styles.amount}>{amount}</h3>
        <div className={styles.titleItems}>
          <span className={styles.title}>{title}</span>
          <div className={styles.chevron}>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  )
}
