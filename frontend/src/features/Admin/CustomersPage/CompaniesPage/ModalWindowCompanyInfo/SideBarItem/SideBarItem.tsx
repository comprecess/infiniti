import { FC } from 'react'

import styles from './SideBarItem.module.scss'

interface SideBarItemProps {
  name: string
  icon: React.ReactNode
  isFirst: boolean
  isLast: boolean
  isActive: boolean
  onClick: () => void
}

export const SideBarItem: FC<SideBarItemProps> = ({
  name,
  icon,
  isFirst,
  isLast,
  isActive,
  onClick,
}) => {
  const wrapperClass = isActive
    ? styles.wrapperActive
    : styles.wrapperDisable

  return (
    <div
      className={`${wrapperClass} ${isFirst ? styles.first : ''} ${
        isLast ? styles.last : ''
      }`}
      onClick={!isActive ? onClick : () => {}}
    >
      <div className={isActive ? styles.iconActive : styles.iconDisable}>
        {icon}
      </div>
      <span
        className={
          isActive ? styles.nameCompanyActive : styles.nameCompanyDisable
        }
      >
        {name}
      </span>
    </div>
  )
}
