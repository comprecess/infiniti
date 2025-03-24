import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title?: string
  type?: 'button' | 'submit' | 'reset'
  style?: string
  styleTitle?: string
  icon?: string
  iconProps?: string
  titleNone?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const ButtonBlue = ({
  title,
  type,
  style,
  styleTitle,
  icon,
  iconProps,
  disabled = false,
  titleNone = false,
  onClick,
}: ButtonBlueProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={
        icon
          ? `${styles.iconWrapper} ${style}`
          : `${styles.ordinaryWrapper} ${style}`
      }
      onClick={onClick}
    >
      {icon ? <img src={icon} alt='Icon' className={iconProps} /> : null}
      {title && (
        <span
          className={
            titleNone
              ? `${styles.titleNone} ${styleTitle}`
              : `${styles.title} ${styleTitle}`
          }
        >
          {title}
        </span>
      )}
    </button>
  )
}
