import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Logo } from '../../../shared/ui/Logo/Logo'
import styles from './AuthOutlet.module.scss'

export const AuthOutlet: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Logo
        logo='/icons/logoBlueWhite.svg'
        styleImage={styles.logoImage}
        style={styles.logoDesktop}
      />
      <Logo
        logo='/icons/logoBlue.svg'
        styleImage={styles.logoImage}
        style={styles.logoMobile}
      />
      <div className={styles.items}>
        <div className={styles.wrapperLeft}>
          <div className={styles.greetings}>
            <h1 className={styles.title}>Namasté digital@goo.ru</h1>
            <span className={styles.description}>
              We&apos;re decentralized IT teams. We help to realize the
              talents of our residents, create IT products for the global
              market and lead our clients to their financial goals by
              shortest possible way.
            </span>
            <span className={styles.description}>
              We create product of your dream in an incubation ambience
              full of digital care.
            </span>
          </div>
        </div>
        <div className={styles.wrapperRight}>
          <Outlet />
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.copyright}>© 2023 INFINITI</span>
      </div>
    </div>
  )
}
