import { BackGround } from '../BackGround/BackGround'
import styles from './NumberItem.module.scss'

interface NumberItemProps {
  number: number
  isActive: boolean
  size?: 'sm' | 'md'
  onClick: () => void
}

export const NumberItem = ({
  number,
  isActive,
  size = 'md',
  onClick,
}: NumberItemProps) => {
  const sizeClass = size === 'md' ? styles.numberMD : styles.numberSM

  return (
    <BackGround isActive={isActive} size={size}>
      <div className={styles.wrapper} onClick={onClick}>
        <span className={sizeClass}>{number}</span>
      </div>
    </BackGround>
  )
}
