import { FC } from 'react'

import { ChevronDownIcon } from '../../../../../shared/icons/ChevronDownIcon'
import styles from './BigCard.module.scss'

interface BigCardProps {
  icon: string
  amount: string
  title: string
}

export const BigCard: FC<BigCardProps> = ({ icon, amount, title }) => {
  return (
    <div className={styles.wrapper}>
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
