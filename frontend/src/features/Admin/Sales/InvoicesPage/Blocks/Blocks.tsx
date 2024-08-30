import { FC } from 'react'

import styles from './Blocks.module.scss'

interface BlocksProps {
  titleAmount: string
  status: string
  percentage: number
  chartBGColor: string
  blockBGColor: string
}

export const Blocks: FC<BlocksProps> = ({
  titleAmount,
  status,
  percentage,
  chartBGColor,
  blockBGColor,
}) => {
  return (
    <div className={`${styles.wrapper} ${blockBGColor}`}>
      <h4 className={styles.title}>{titleAmount}</h4>
      <div className={styles.container}>
        <span className={styles.status}>{status}</span>
        <div className={styles.segments}>
          <div className={styles.backgroundSegment}>
            <div
              className={`${styles.segment} ${chartBGColor}`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
        <span className={styles.percentage}>{`${percentage}%`}</span>
      </div>
    </div>
  )
}
