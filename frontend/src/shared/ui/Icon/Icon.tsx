import { FC } from 'react'

import styles from './Icon.module.scss'

interface IconProps {
  icon: React.ReactNode
  fill?: boolean
  style?: string
  onIconClick?: () => void
}

export const Icon: FC<IconProps> = ({
  icon,
  style,
  fill = true,
  onIconClick,
}) => {
  return (
    <div
      className={
        fill
          ? `${styles.wrapperFill} ${style}`
          : `${styles.wrapperStroke} ${style}`
      }
      onClick={onIconClick}
    >
      {icon}
    </div>
  )
}
