import styles from './Item.module.scss'

interface ItemProps {
  title: string
  value?: string
}

export const Item = ({ title, value }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{`${title}:`}</span>
      <span className={styles.value} contentEditable={false}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
