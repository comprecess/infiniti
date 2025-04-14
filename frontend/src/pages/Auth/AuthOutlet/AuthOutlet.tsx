import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { Logo } from '../../../shared/ui/Logo/Logo'
import styles from './AuthOutlet.module.scss'

export const AuthOutlet = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadingComponent = () => {
      setIsReady(true)
    }

    loadingComponent()
  }, [])

  return (
    <div className={styles.wrapper}>
      {!isReady ? (
        <div />
      ) : (
        <>
          <div className={styles.logo}>
            <Logo logo={<LogoTextIcon />} style={styles.logoMobile} />
          </div>
          <div className={styles.items}>
            <div className={styles.wrapperLeft}>
              <div className={styles.greetings}>
                <h1 className={styles.title} contentEditable={false}>
                  Namasté
                </h1>
                <span className={styles.description}>
                  We’re decentralized IT teams, built to move fast and
                  deliver results. We help our residents grow, build
                  products for the global market, and guide our clients
                  toward their financial goals — as efficiently as
                  possible.
                </span>
                <span className={styles.description}>
                  Think of us as your product incubator — focused,
                  flexible, and fully digital.
                </span>
                <span className={styles.description}>
                  If you can dream it, we’ll help you build it.
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
        </>
      )}
    </div>
  )
}
