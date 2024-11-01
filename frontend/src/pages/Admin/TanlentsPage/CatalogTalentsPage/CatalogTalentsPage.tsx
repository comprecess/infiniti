import { FC, useCallback, useEffect, useState } from 'react'

import { FiltersState } from '../../../../app/constants/constants'
import { CatalogCategories } from '../../../../app/data/catalogCategories'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { Filters } from '../../../../features/Admin/TalentsPage/CatalogTalents/Filters/Filters'
import { TalentsList } from '../../../../features/Admin/TalentsPage/CatalogTalents/TalentsList/TalentsList'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import styles from './CatalogTalentsPage.module.scss'

export const AdminCatalogTalentsPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sort, setSort] = useState<{
    sort: { name: string; type: string }
  }>({
    sort: { name: 'priceDay', type: 'asc' },
  })
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const setCategories = (category: string) => {
    setActiveCategory(category)
  }

  const handleSetSort = useCallback((name: string, type: string) => {
    setSort({ sort: { name, type } })
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Catalog Talents'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Catalog' />
      </div>
      <section className={styles.sectionFirst}>
        <div className={styles.itemsFirst}>
          <span className={styles.categoriesText}>Categories</span>
          <div className={styles.categories}>
            <CategoriesItem
              name='All'
              isActive={activeCategory === 'All'}
              onClick={() => setCategories('All')}
            />
            {CatalogCategories.map(category => {
              return (
                <CategoriesItem
                  key={category}
                  name={category}
                  isActive={activeCategory === category}
                  onClick={() => setCategories(category)}
                />
              )
            })}
          </div>
        </div>
      </section>
      <section className={styles.sectionSecond}>
        <div className={styles.itemsSecond}>
          <Filters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setSort={handleSetSort}
          />
          <TalentsList
            sort={sort}
            setSort={setSort}
            selectedFilters={selectedFilters}
          />
        </div>
      </section>
    </div>
  )
}
