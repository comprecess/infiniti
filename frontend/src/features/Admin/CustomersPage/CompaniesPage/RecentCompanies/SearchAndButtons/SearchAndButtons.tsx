import { FC } from 'react'

import { Search } from '../../../../../../shared/ui/Search/Search'
import { RecentRightButtons } from '../../RecentRightButtons/RecentRightButtons'
import styles from './SearchAndButtons.module.scss'

interface SearchAndButtonsProps {
  searchChange: (searchItem: string) => void
}

export const SearchAndButtons: FC<SearchAndButtonsProps> = ({
  searchChange,
}) => {
  const handleSearchChange = (searchItem: string) => {
    searchChange(searchItem)
  }

  return (
    <div className={styles.header}>
      <div className={styles.search}>
        <Search onSearchChange={handleSearchChange} />
      </div>
      <div className={styles.headerButtons}>
        <RecentRightButtons />
      </div>
    </div>
  )
}
