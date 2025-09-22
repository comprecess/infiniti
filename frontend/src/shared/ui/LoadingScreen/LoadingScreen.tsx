import styles from './LoadingScreen.module.scss'
import { LogoTextIcon } from '../../icons/LogoTextIcon'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'

export const LoadingScreen = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <LogoTextIcon style={styles.logoIcon} />
        <span className={styles.description}>Providing Lasting Value</span>
      </div>
      <div className={styles.footer}>
        <LoadingSpinner />
        <h3 className={styles.text}>Loading resources...</h3>
      </div>
    </div>
  )
}
