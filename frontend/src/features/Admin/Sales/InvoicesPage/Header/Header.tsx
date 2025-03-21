import { Search } from '../../../../../shared/ui/Search/Search'
import { RecentRightButtons } from '../../../CustomersPage/CompaniesPage/RecentRightButtons/RecentRightButtons'
import styles from './Header.module.scss'
import { Tabs } from './Tabs/Tabs'

interface HeaderProps {
  isActiveTab: string
  setIsActiveTab: (name: string) => void
  searchChange: (searchItem: string) => void
  rightButtons: (name: string) => void
}

export const Header = ({
  isActiveTab,
  setIsActiveTab,
  searchChange,
  rightButtons,
}: HeaderProps) => {
  const handleSearchChange = (searchItem: string) => {
    searchChange(searchItem)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <Tabs isActiveTab={isActiveTab} setIsActiveTab={setIsActiveTab} />
      </div>
      <div className={styles.header}>
        <div className={styles.search}>
          <Search onSearchChange={handleSearchChange} />
        </div>
        <div className={styles.headerButtons}>
          <RecentRightButtons rightButtons={rightButtons} />
        </div>
      </div>
    </div>
  )
}
