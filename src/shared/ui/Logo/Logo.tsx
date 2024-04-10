import { FC } from 'react'

import styles from './Logo.module.scss'

interface LogoProps {
  logo: string
  style?: string
  styleImage?: string
}

export const Logo: FC<LogoProps> = ({ style, logo, styleImage }) => {
  return (
    <div className={`${styles.wrapper} ${style}`}>
      <img className={styleImage} src={logo} alt='Logo' />
    </div>
  )
}
