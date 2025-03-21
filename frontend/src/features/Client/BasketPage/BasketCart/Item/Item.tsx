import styles from './Item.module.scss'

interface ItemProps {
  title: string
  amount: string
  icon?: string
}

export const Item = ({ title, amount, icon }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      {icon ? (
        <div className={styles.items}>
          <span className={styles.title}>{title}</span>
          <img src={icon} alt='Info' />
        </div>
      ) : (
        <span className={styles.title}>{title}</span>
      )}
      <span className={styles.amount}>{amount}</span>
    </div>
  )
}
