import { FC, PropsWithChildren, useState } from 'react'

import { ChevronDownIcon } from '../../../../../shared/icons/ChevronDownIcon'
import { Search } from '../../../../../shared/ui/Search/Search'
import styles from './CategoryItem.module.scss'

interface CategoryItemProps {
  title: string
  isSearched?: boolean
  categoriesLength?: number
}

export const CategoryItem: FC<PropsWithChildren<CategoryItemProps>> = ({
  title,
  isSearched = false,
  categoriesLength,
  children,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const handleClick = () => {
    setIsOpened(!isOpened)
  }

  return (
    <>
      <div className={styles.wrapper} onClick={handleClick}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {categoriesLength && (
            <span className={styles.categoriesLength}>
              {categoriesLength}
            </span>
          )}
        </div>
        <ChevronDownIcon
          style={isOpened ? styles.chevronClose : styles.chevronOpen}
        />
      </div>
      <div>
        {!isOpened || (
          <div className={styles.categories}>
            {!isSearched || <Search />}
            {<div className={styles.children}>{children}</div>}
          </div>
        )}
      </div>
    </>
  )
}
