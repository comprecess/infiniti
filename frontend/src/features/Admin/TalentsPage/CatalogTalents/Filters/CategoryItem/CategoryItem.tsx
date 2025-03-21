import { PropsWithChildren, useState } from 'react'

import { ChevronDownIcon } from '../../../../../../shared/icons/ChevronDownIcon'
import { Search } from '../../../../../../shared/ui/Search/Search'
import styles from './CategoryItem.module.scss'

interface CategoryItemProps {
  title: string
  isSearched?: boolean
  secondName?: string
  handleSearchChange?: (searchItem: string) => void
}

export const CategoryItem = ({
  title,
  isSearched = false,
  secondName,
  handleSearchChange,
  children,
}: PropsWithChildren<CategoryItemProps>) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const handleClick = () => {
    setIsOpened(!isOpened)
  }

  return (
    <>
      <div className={styles.wrapper} onClick={handleClick}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {secondName && (
            <span className={styles.categoriesLength}>{secondName}</span>
          )}
        </div>
        <ChevronDownIcon
          style={isOpened ? styles.chevronClose : styles.chevronOpen}
        />
      </div>
      <div>
        {!isOpened || (
          <div className={styles.categories}>
            {isSearched && handleSearchChange && (
              <Search onSearchChange={handleSearchChange} />
            )}
            {<div className={styles.children}>{children}</div>}
          </div>
        )}
      </div>
    </>
  )
}
