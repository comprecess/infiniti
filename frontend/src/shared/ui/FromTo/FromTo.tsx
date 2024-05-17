import { FC } from 'react'

import styles from './FromTo.module.scss'
import { Input } from './Input/Input'

interface FromToProps {
  title?: string
  placeholderFirst: string
  placeholderSecond: string
}

export const FromTo: FC<FromToProps> = ({
  title,
  placeholderFirst,
  placeholderSecond,
}) => {
  return (
    <div className={styles.wrapper}>
      {title && <span className={styles.title}>{title}</span>}
      <div className={styles.inputs}>
        <Input placeholder={placeholderFirst} />
        <Input placeholder={placeholderSecond} />
      </div>
    </div>
  )
}
