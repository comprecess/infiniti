import { FC } from 'react'

import { LogoTextIcon } from '../../icons/LogoTextIcon'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import styles from './LoadingScreen.module.scss'

export const LoadingScreen: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <LogoTextIcon style={styles.logoIcon} />
        <span className={styles.description}>Career no limits</span>
      </div>
      <div className={styles.footer}>
        <LoadingSpinner />
        <h3 className={styles.text}>Loading resources...</h3>
      </div>
    </div>
  )
}
