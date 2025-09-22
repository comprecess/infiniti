import styles from './ArrowItem.module.scss'
import { BackGround } from '../BackGround/BackGround'

interface ArrowItemProps {
  isLeftArrow?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  onClick: () => void
}

export const ArrowItem = ({
  isLeftArrow = true,
  disabled = false,
  size,
  onClick,
}: ArrowItemProps) => {
  return (
    <BackGround size={size}>
      <button
        disabled={disabled}
        className={styles.button}
        onClick={onClick}
      >
        <img
          src='/icons/chevronLeftLight.svg'
          className={isLeftArrow ? '' : styles.right}
        />
      </button>
    </BackGround>
  )
}
