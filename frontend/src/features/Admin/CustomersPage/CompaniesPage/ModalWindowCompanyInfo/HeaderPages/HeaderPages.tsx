import { FC, PropsWithChildren } from 'react'

import styles from './HeaderPages.module.scss'

interface HeaderPagesProps {
  title: string
}

export const HeaderPages: FC<PropsWithChildren<HeaderPagesProps>> = ({
  title,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div>{children}</div>
    </div>
  )
}
