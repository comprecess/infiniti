import { FC, useEffect, useRef } from 'react'

import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
  style?: string
  styleTitle?: string
  icon?: string
  iconProps?: string
  titleNone?: boolean
  onClick?: () => void
}

export const ButtonBlue: FC<ButtonBlueProps> = ({
  title,
  type,
  style,
  styleTitle,
  icon,
  iconProps,
  titleNone = false,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type={type}
      className={
        icon
          ? `${styles.iconWrapper} ${style}`
          : `${styles.ordinaryWrapper} ${style}`
      }
      onClick={onClick}
    >
      {icon ? <img src={icon} alt='Icon' className={iconProps} /> : null}
      <span
        className={
          titleNone
            ? `${styles.titleNone} ${styleTitle}`
            : `${styles.title} ${styleTitle}`
        }
      >
        {title}
      </span>
    </button>
  )
}
