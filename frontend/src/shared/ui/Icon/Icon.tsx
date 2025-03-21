import { ReactNode } from 'react'

import styles from './Icon.module.scss'

interface IconProps {
  icon: ReactNode
  fill?: boolean
  style?: string
  hover?: boolean
  onIconClick?: () => void
}

export const Icon = ({
  icon,
  style,
  fill = true,
  hover = true,
  onIconClick,
}: IconProps) => {
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
