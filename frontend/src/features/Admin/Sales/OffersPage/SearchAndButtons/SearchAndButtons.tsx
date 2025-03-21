import { Search } from '../../../../../shared/ui/Search/Search'
import { RecentRightButtons } from '../../../CustomersPage/CompaniesPage/RecentRightButtons/RecentRightButtons'
import styles from './SearchAndButtons.module.scss'

interface SearchAndButtonsProps {
  searchChange: (searchItem: string) => void
  rightButtons?: (name: string) => void
}

export const SearchAndButtons = ({
  searchChange,
  rightButtons,
}: SearchAndButtonsProps) => {
  const handleSearchChange = (searchItem: string) => {
    searchChange(searchItem)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <Search onSearchChange={handleSearchChange} />
      </div>
      <div className={styles.headerButtons}>
        <RecentRightButtons rightButtons={rightButtons} />
      </div>
    </div>
  )
}
