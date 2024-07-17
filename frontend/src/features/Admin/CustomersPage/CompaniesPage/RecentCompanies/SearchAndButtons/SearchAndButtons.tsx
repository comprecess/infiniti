import { FC } from 'react'

import { Search } from '../../../../../../shared/ui/Search/Search'
import { RecentRightButtons } from '../../RecentRightButtons/RecentRightButtons'
import styles from './SearchAndButtons.module.scss'

export const SearchAndButtons: FC = () => {
  const handleSearchChange = (searchItem: string) => {
    console.log(searchItem)
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
