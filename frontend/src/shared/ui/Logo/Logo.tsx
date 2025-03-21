import { ReactNode } from 'react'

import styles from './Logo.module.scss'

interface LogoProps {
  logo: ReactNode
  style?: string
}

export const Logo = ({ style, logo }: LogoProps) => {
  return <div className={`${styles.wrapper} ${style}`}>{logo}</div>
}
