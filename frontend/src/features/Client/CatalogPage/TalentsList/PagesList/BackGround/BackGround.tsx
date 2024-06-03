import { FC, PropsWithChildren } from 'react'

import styles from './BackGround.module.scss'

interface BackGroundProps {
  isActive?: boolean
}

export const BackGround: FC<PropsWithChildren<BackGroundProps>> = ({
  isActive = false,
  children,
}) => {
  return (
    <div
      className={
        isActive
          ? `${styles.wrapper} ${styles.active}`
          : `${styles.wrapper} ${styles.disable}`
      }
    >
      {children}
    </div>
  )
}
