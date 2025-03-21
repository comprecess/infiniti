import styles from './Item.module.scss'

interface ItemProps {
  title: string
  info: string
}

export const Item = ({ title, info }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.info} contentEditable={false}>
        {info}
      </span>
    </div>
  )
}
