import { ReactNode } from 'react'

import styles from './InfoItem.module.scss'

interface InfoItemProps {
  title: string
  value?: string
  ValueComponent?: ReactNode
}

export const InfoItem = ({ title, value, ValueComponent }: InfoItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{`${title}:`}</span>
      {ValueComponent ? (
        ValueComponent
      ) : (
        <span className={styles.value} contentEditable={false}>
          {value ? value : '-'}
        </span>
      )}
    </div>
  )
}
