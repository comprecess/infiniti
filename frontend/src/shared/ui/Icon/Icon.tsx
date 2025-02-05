import { FC } from 'react'

import styles from './Icon.module.scss'

interface IconProps {
  icon: React.ReactNode
  fill?: boolean
  style?: string
  hover?: boolean
  onIconClick?: () => void
}

export const Icon: FC<IconProps> = ({
  icon,
  style,
  fill = true,
  hover = true,
  onIconClick,
}) => {
  return (
    <div
      className={
        fill
          ? `${styles.wrapperFill} ${
              hover ? styles.wrapperFillHover : ''
            } ${style}`
          : `${styles.wrapperStroke} ${
              hover ? styles.wrapperStrokeHover : ''
            }${style}`
      }
      onClick={onIconClick}
    >
      {icon}
    </div>
  )
}
