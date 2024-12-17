import styles from './Filters.module.scss'

export const Filters = () => {
  const handleFiltersReset = () => {}

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6 className={styles.title}>Filters</h6>
        <span className={styles.buttonReset} onClick={handleFiltersReset}>
          Reset filters
        </span>
      </div>
      <div className={styles.filters}>-Filters-</div>
    </div>
  )
}
