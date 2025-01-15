import { useCallback, useEffect, useState } from 'react'

import {
  FiltersData,
  FiltersState,
} from '../../../../app/constants/constants'
import { Filters } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetPropertiesFiltering'
import styles from './BusinessModelsPage.module.scss'

export const AdminBusinessModelsPage = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const [categories, setCategories] = useState<FiltersData | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const getCategories = useCallback(async () => {
    const categoriesAnswer = await getPropertiesFiltering(
      '?prop=specialization',
    )

    setCategories(categoriesAnswer.data[0])
  }, [])

  const setCategory = () => {
    if (!categories || categories.id === undefined) return

    const categoryKey = categories.id.toString()

    const categoryValue =
      categories?.values[activeCategory - 1]?.id ?? null

    if (categoryValue === null) {
      const newFilters = { ...selectedFilters }

      delete newFilters[categoryKey]

      setSelectedFilters(newFilters)
    } else {
      const newFilters = {
        ...selectedFilters,
        [categoryKey]: [categoryValue],
      }
      setSelectedFilters(newFilters)
    }
  }

  useEffect(() => {
    getCategories()

    window.scrollTo(0, 0)
    document.title = 'infiniti | Business Models'
  }, [])

  useEffect(() => {
    setCategory()
  }, [activeCategory])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Business Models' />
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
                const updatedCategory = category.value.replace(
                  /&amp;/g,
                  '&',
                )

                return (
                  <CategoriesItem
                    key={index + 1}
                    name={updatedCategory}
                    isActive={activeCategory === index + 1}
                    onClick={() => setActiveCategory(index + 1)}
                  />
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
      <section className={styles.sectionSecond}>
        <div className={styles.itemsSecond}>
          <Filters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setActiveCategory={setActiveCategory}
          />
          <ModelsList isAdmin selectedFilters={selectedFilters} />
        </div>
      </section>
    </div>
  )
}
