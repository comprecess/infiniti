import { ChangeEvent, FC } from 'react'

import styles from './Search.module.scss'

interface SearchProps {
  onSearchChange: (searchItem: string) => void
}

export const Search: FC<SearchProps> = ({ onSearchChange }) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <div className={styles.wrapper}>
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
