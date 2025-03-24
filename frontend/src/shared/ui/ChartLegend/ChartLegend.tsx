import styles from './ChartLegend.module.scss'

interface ChartLegendProps {
  title: string
  color: string
}

export const ChartLegend = ({ title, color }: ChartLegendProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.cube} ${color}`} />
      <span className={styles.title}>{title}</span>
    </div>
  )
}
