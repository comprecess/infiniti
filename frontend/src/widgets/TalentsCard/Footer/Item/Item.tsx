import styles from './Item.module.scss'

interface ItemProps {
  title: string
  description: string
}

export const Item = ({ title, description }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <h5 className={styles.title}>{title}</h5>
      <span className={styles.description}>{description}</span>
    </div>
  )
}
