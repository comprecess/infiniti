import { ReactNode } from 'react'

import styles from './PageItem.module.scss'

interface PageItemProps {
  title: string
  icon: ReactNode
  isActive: boolean
  page: string
  type: number | null
  onClick: (namePage: string) => void
}

export const PageItem = ({
  title,
  icon,
  isActive,
  page,
  type,
  onClick,
}: PageItemProps) => {
  const handleOnClick = () => {
    onClick(page)
  }

  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperDisable}
      onClick={!isActive ? handleOnClick : () => {}}
    >
      <div className={styles.container}>
        <div className={isActive ? styles.iconActive : styles.iconDisable}>
          {icon}
        </div>
        <span
          className={isActive ? styles.titleActive : styles.titleDisable}
        >
          {title}
        </span>
      </div>
      {type !== null && (
        <div className={styles.badge}>
          <span className={styles.count}>{type}</span>
        </div>
      )}
    </div>
  )
}
