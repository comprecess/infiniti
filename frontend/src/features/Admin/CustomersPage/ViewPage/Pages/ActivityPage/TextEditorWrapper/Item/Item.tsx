import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  iconComponent: React.ReactNode
  nameIcon: string
  isActive: boolean
  isStroke: boolean
  onClick: (nameIcon: string) => void
}

export const Item: FC<ItemProps> = ({
  iconComponent,
  nameIcon,
  isActive,
  isStroke,
  onClick,
}) => {
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
