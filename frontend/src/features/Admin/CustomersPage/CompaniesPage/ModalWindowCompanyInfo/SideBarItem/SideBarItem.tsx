import { FC } from 'react'

import styles from './SideBarItem.module.scss'

interface SideBarItemProps {
  name: string
  icon: React.ReactNode
  isFirst: boolean
  isLast: boolean
}

export const SideBarItem: FC<SideBarItemProps> = ({
  name,
  icon,
  isFirst,
  isLast,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${isFirst ? styles.first : ''} ${
        isLast ? styles.last : ''
      }`}
    >
      <div className={styles.icon}>{icon}</div>
      <span className={styles.nameCompany}>{name}</span>
    </div>
  )
}
