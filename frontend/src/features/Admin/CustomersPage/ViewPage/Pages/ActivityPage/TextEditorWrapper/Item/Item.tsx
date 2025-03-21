import { ReactNode } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  iconComponent: ReactNode
  nameIcon: string
  isActive: boolean
  isStroke: boolean
  onClick: (nameIcon: string) => void
}

export const Item = ({
  iconComponent,
  nameIcon,
  isActive,
  isStroke,
  onClick,
}: ItemProps) => {
  const handleClick = () => {
    onClick(nameIcon)
  }

  const iconStyle = isActive
    ? isStroke
      ? styles.iconStrokeActive
      : styles.iconFillActive
    : isStroke
    ? styles.iconStrokeDisable
    : styles.iconFillDisable

  return (
    <div className={styles.iconButton} onClick={handleClick}>
      <div className={iconStyle}>{iconComponent}</div>
    </div>
  )
}
