import styles from './SearchAndButtons.module.scss'
import { Search } from '../../../../../../shared/ui/Search/Search'
import { RecentRightButtons } from '../../RecentRightButtons/RecentRightButtons'

interface SearchAndButtonsProps {
  searchChange: (searchItem: string) => void
  searchValue?: string
  rightButtons?: (name: string) => void
}

export const SearchAndButtons = ({
  searchValue,
  searchChange,
  rightButtons,
}: SearchAndButtonsProps) => {
  const handleSearchChange = (searchItem: string) => {
    searchChange(searchItem)
  }

  return (
    <div className={styles.header}>
      <div className={styles.search}>
        <Search
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
      </div>
      <div className={styles.headerButtons}>
        <RecentRightButtons rightButtons={rightButtons} />
      </div>
    </div>
  )
}
