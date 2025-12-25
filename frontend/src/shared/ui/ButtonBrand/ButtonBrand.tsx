import styles from './ButtonBrand.module.scss'

interface ButtonBrandProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
  style?: string
  icon?: string
  iconProps?: string
  titleNone?: boolean
  onClick?: () => void
}

export const ButtonBrand = ({
  title,
  type,
  style,
  icon,
  iconProps,
  titleNone = false,
  onClick,
}: ButtonBrandProps) => {
  const baseClass = icon ? styles.iconWrapper : styles.ordinaryWrapper

  return (
    <button type={type} className={`${baseClass} ${style || ''}`} onClick={onClick}>
      {icon ? <img src={icon} alt='Icon' className={iconProps} /> : null}
      <span className={titleNone ? styles.titleNone : styles.title}>{title}</span>
    </button>
  )
}
