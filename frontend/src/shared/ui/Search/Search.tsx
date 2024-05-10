import { FC } from 'react'

import styles from './Search.module.scss'

export const Search: FC = () => {
  return (
    <div className={styles.wrapper}>
      <img
        src='/icons/search.svg'
        alt='Search'
        className={styles.iconSearch}
      />
      <input type='text' placeholder='Search' className={styles.input} />
    </div>
  )
}
