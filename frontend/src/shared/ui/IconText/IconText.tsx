import styles from './IconText.module.scss'

interface IconTextProps {
  icon: string
  text: string
  style?: string
  styleIcon?: string
  styleText?: string
  onClick?: () => void
}

export const IconText = ({
  icon,
  text,
  style,
  styleIcon,
  styleText,
  onClick,
}: IconTextProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className={`${styles.wrapper} ${style}`} onClick={handleClick}>
      <img
        className={`${styles.icon} ${styleIcon}`}
        src={icon}
        alt={text}
      />
      <span className={`${styles.text} ${styleText}`}>{text}</span>
    </div>
  )
}
