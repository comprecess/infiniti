import { FC, useCallback, useEffect, useState } from 'react'

import {
  FiltersData,
  FiltersState,
} from '../../../app/constants/constants'
import { CategoriesItem } from '../../../features/Client/CatalogPage/CategoriesItem/CategoriesItem'
import { Filters } from '../../../features/Client/CatalogPage/Filters/Filters'
import { TalentsList } from '../../../features/Client/CatalogPage/TalentsList/TalentsList'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import styles from './TalentsPage.module.scss'

export const ClientTalentsPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [categories, setCategories] = useState<FiltersData | null>(null)
  const [sort, setSort] = useState({ name: 'priceDay', type: 'asc' })
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getPropertiesFiltering('?prop=specialization')
      setCategories(data[0])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const updateFilters = useCallback(() => {
    if (!categories || categories.id === undefined) return

    const categoryKey = categories.id.toString()
    const categoryValue = categories.values[activeCategory - 1]?.id || null

    setSelectedFilters(prev => {
      const updatedFilters = { ...prev }
      if (categoryValue === null) {
        delete updatedFilters[categoryKey]
      } else {
        updatedFilters[categoryKey] = [categoryValue]
      }

      return updatedFilters
    })
  }, [categories, activeCategory])

  useEffect(() => {
    fetchCategories()

    window.scrollTo(0, 0)
    document.title = 'infiniti | Catalog Talents'
  }, [fetchCategories])

  useEffect(() => {
    updateFilters()
  }, [activeCategory, updateFilters])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Catalog' />
      </div>
      {categories ? (
        <section className={styles.sectionFirst}>
          <div className={styles.itemsFirst}>
            <span className={styles.categoriesText}>Categories</span>
            <div className={styles.categories}>
              <CategoriesItem
                name='All'
                isActive={activeCategory === 0}
                onClick={() => setActiveCategory(0)}
              />
              {categories.values.map((category, index) => {
                return (
                  <CategoriesItem
                    key={index + 1}
                    name={category.value}
                    isActive={activeCategory === index + 1}
                    onClick={() => setActiveCategory(index + 1)}
                  />
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
      <section className={styles.sectionSecond}>
        <div className={styles.itemsSecond}>
          <Filters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setActiveCategory={setActiveCategory}
            setSort={setSort}
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
