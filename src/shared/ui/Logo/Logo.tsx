import { FC } from 'react'

import styles from './Logo.module.scss'

interface LogoProps {
  style?: string
}

export const Logo: FC<LogoProps> = ({ style }) => {
  return (
    <div className={style ? style : styles.wrapper}>
      <img src='/icons/logo.svg' alt='Logo' />
    </div>
  )
}
