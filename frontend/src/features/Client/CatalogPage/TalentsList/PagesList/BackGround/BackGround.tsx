import { PropsWithChildren } from 'react'

import styles from './BackGround.module.scss'

interface BackGroundProps {
  isActive?: boolean
  size?: 'sm' | 'md'
  backGroundActive?: boolean
}

export const BackGround = ({
  isActive = false,
  children,
  size = 'md',
  backGroundActive = true,
}: PropsWithChildren<BackGroundProps>) => {
  const sizeClass = size === 'md' ? styles.wrapperMD : styles.wrapperSM
  const stateClass = isActive ? styles.active : styles.disable
  const backGroundNone =
    size === 'md' ? styles.wrapperMD : styles.wrapperSM

  return (
    <div
      className={
        backGroundActive ? `${sizeClass} ${stateClass}` : backGroundNone
      }
    >
      {children}
    </div>
  )
}
