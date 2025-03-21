import { RolesAccess } from '../../../../../app/constants/constants'
import { Search } from '../../../../../shared/ui/Search/Search'
import styles from './Header.module.scss'
import { Tabs } from './Tabs/Tabs'

interface HeaderProps {
  access: RolesAccess
  isActiveTab: string
  setIsActiveTab: (name: string) => void
  searchChange: (searchItem: string) => void
}

export const Header = ({
  access,
  isActiveTab,
  setIsActiveTab,
  searchChange,
}: HeaderProps) => {
  const handleSearchChange = (searchItem: string) => {
    searchChange(searchItem)
  }

  return (
    <div className={styles.wrapper}>
      {access && (
        <>
          <div className={styles.tabs}>
            <Tabs
              isActiveTab={isActiveTab}
              setIsActiveTab={setIsActiveTab}
              access={access}
            />
          </div>
          <Search
            style={styles.search}
            onSearchChange={handleSearchChange}
          />
        </>
      )}
    </div>
  )
}
