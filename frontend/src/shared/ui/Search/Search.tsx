import { ChangeEvent } from 'react'

import styles from './Search.module.scss'

interface SearchProps {
  style?: string
  onSearchChange: (searchItem: string) => void
}

export const Search = ({ style, onSearchChange }: SearchProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <div className={`${styles.wrapper} ${style}`}>
      <img
        src='/icons/search.svg'
        alt='Search'
        className={styles.iconSearch}
      />
      <input
        type='text'
        placeholder='Search'
        className={styles.input}
        onChange={handleSearchChange}
      />
    </div>
  )
}
