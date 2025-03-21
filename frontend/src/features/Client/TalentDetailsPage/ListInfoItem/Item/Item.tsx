import styles from './Item.module.scss'

interface ItemProps {
  title: string
}

export const Item = ({ title }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
