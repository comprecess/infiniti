import { useEffect } from 'react'

import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewBusinessPlanPage.module.scss'

export const AdminViewBusinessPlanPage = () => {
  useEffect(() => {
    document.title = 'infiniti | View Business Plan'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.header}>
          <img
            src='/logoInfinitiWhite.svg'
            alt='Logo'
            className={styles.logo}
          />
          <span className={styles.title}>BUSINESS PLAN</span>
          <div className={styles.preparedBy}>
            <span className={styles.name}>Pavel INFINITI</span>
            <span className={styles.email}>ceo@infiniti.stream</span>
            <span className={styles.website}>https://infiniti.stream</span>
            <span className={styles.phone}>+79005131917</span>
          </div>
          <span className={styles.dateTitle}>2021-08-14</span>
        </div>
        <RecentCard>
          <div className={styles.contentWrapper}>
            <div className={styles.contentCard}>
              <div className={styles.contentTitle}>Title</div>
              <span className={styles.content}>content</span>
            </div>
          </div>
        </RecentCard>
      </section>
    </div>
  )
}
