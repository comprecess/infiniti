import { FC, PropsWithChildren } from 'react'

import styles from './BackGround.module.scss'

export const BackGround: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>
}
