import { FC } from 'react'

import styles from './Logo.module.scss'

interface LogoProps {
  logo: React.ReactNode
  style?: string
}

export const Logo: FC<LogoProps> = ({ style, logo }) => {
  return <div className={`${styles.wrapper} ${style}`}>{logo}</div>
}
