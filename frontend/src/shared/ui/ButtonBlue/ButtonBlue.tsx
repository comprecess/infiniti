import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'outline'
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
  variant = 'default',
  style,
  styleTitle,
  icon,
  iconProps,
  disabled = false,
  titleNone = false,
  onClick,
}: ButtonBlueProps) => {
  const baseClass = icon ? styles.iconWrapper : styles.ordinaryWrapper
  const variantClass = variant === 'outline' ? styles.outline : styles.default

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${style || ''}`}
      onClick={onClick}
    >
      {icon && <img src={icon} alt='Icon' className={iconProps} />}
      {title && (
        <span
          className={
            titleNone
              ? `${styles.titleNone} ${styleTitle || ''}`
              : `${styles.title} ${styleTitle || ''}`
          }
        >
          {title}
        </span>
      )}
    </button>
  )
}
