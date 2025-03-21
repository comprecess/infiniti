import styles from './CategoriesItem.module.scss'

interface CategoriesItemProps {
  name: string
  isActive: boolean
  onClick: () => void
}

export const CategoriesItem = ({
  name,
  isActive,
  onClick,
}: CategoriesItemProps) => {
  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperDisable}
      onClick={onClick}
    >
      <span className={styles.name}>{name}</span>
    </div>
  )
}
