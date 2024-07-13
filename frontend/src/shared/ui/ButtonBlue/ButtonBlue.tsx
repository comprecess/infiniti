import { FC } from 'react'

import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
  style?: string
  icon?: string
  iconProps?: string
  titleNone?: boolean
  onClick?: () => void
}

export const ButtonBlue: FC<ButtonBlueProps> = ({
  title,
  type,
  style,
  icon,
  iconProps,
  titleNone = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={
        icon
          ? `${styles.iconWrapper} ${style}`
          : `${styles.ordinaryWrapper} ${style}`
      }
      onClick={onClick}
    >
      {icon ? <img src={icon} alt='Icon' className={iconProps} /> : null}
      <span className={titleNone ? styles.titleNone : styles.title}>
        {title}
      </span>
    </button>
  )
}
