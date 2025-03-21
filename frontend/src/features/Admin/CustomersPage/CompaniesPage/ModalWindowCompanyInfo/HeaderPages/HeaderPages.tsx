import { PropsWithChildren } from 'react'

import styles from './HeaderPages.module.scss'

interface HeaderPagesProps {
  title: string
}

export const HeaderPages = ({
  title,
  children,
}: PropsWithChildren<HeaderPagesProps>) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div>{children}</div>
    </div>
  )
}
