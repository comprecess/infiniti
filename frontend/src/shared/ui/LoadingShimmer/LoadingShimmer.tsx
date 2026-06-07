import styles from './LoadingShimmer.module.scss'

interface LoadingShimmerProps {
  rows?: number
  variant?: 'table' | 'card' | 'list' | 'detail'
  className?: string
}

export const LoadingShimmer = ({
  rows = 5,
  variant = 'table',
  className = '',
}: LoadingShimmerProps) => {
  const renderTableRows = () => (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <div className={`${styles.shimmer} ${styles.headerCell}`} />
        <div className={`${styles.shimmer} ${styles.headerCell}`} />
        <div className={`${styles.shimmer} ${styles.headerCell} ${styles.short}`} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className={`${styles.shimmer} ${styles.cell}`} />
          <div className={`${styles.shimmer} ${styles.cell} ${styles.wide}`} />
          <div className={`${styles.shimmer} ${styles.cell} ${styles.short}`} />
        </div>
      ))}
    </div>
  )

  const renderCardRows = () => (
    <div className={styles.cardWrapper}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.card} style={{ animationDelay: `${i * 0.15}s` }}>
          <div className={`${styles.shimmer} ${styles.cardIcon}`} />
          <div className={styles.cardContent}>
            <div className={`${styles.shimmer} ${styles.cardTitle}`} />
            <div className={`${styles.shimmer} ${styles.cardSubtitle}`} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderListRows = () => (
    <div className={styles.listWrapper}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.listItem} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className={`${styles.shimmer} ${styles.listIcon}`} />
          <div className={`${styles.shimmer} ${styles.listText}`} />
          <div className={`${styles.shimmer} ${styles.listAction}`} />
        </div>
      ))}
    </div>
  )

  const renderDetailRows = () => (
    <div className={styles.detailWrapper}>
      <div className={`${styles.shimmer} ${styles.detailHeader}`} />
      <div className={styles.detailBody}>
        <div className={`${styles.shimmer} ${styles.detailLine}`} />
        <div className={`${styles.shimmer} ${styles.detailLine} ${styles.wide}`} />
        <div className={`${styles.shimmer} ${styles.detailLine} ${styles.short}`} />
      </div>
      <div className={styles.detailBody}>
        <div className={`${styles.shimmer} ${styles.detailLine} ${styles.wide}`} />
        <div className={`${styles.shimmer} ${styles.detailLine}`} />
      </div>
    </div>
  )

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {variant === 'table' && renderTableRows()}
      {variant === 'card' && renderCardRows()}
      {variant === 'list' && renderListRows()}
      {variant === 'detail' && renderDetailRows()}
    </div>
  )
}
