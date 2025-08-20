import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
  BusinessPlanBusinessModelData,
  FiltersState,
  page,
  PagesMetaData,
  userModelsPageString,
} from '../../../app/constants/constants'
import { Filters } from '../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { CategoriesItem } from '../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessModelProperties } from '../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-properties'
import { postBusinessModelsList } from '../../../shared/utils/api/Client/BusinessModels/post-business-models-list'
import { getSession } from '../../../shared/utils/Saving/Session/GetSession'
import styles from './BusinessModelsPage.module.scss'

export const ClientBusinessModelsPage = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userModelsPageString) || 1,
  )

  const { data: modelsList } = useQuery({
    queryKey: ['models', currentPage, JSON.stringify(selectedFilters)],
    queryFn: async () => {
      const response = await postBusinessModelsList(
        page + String(currentPage),
        selectedFilters,
      )

      if (!response.status) return

      if (currentPage > response.data.meta.last_page) {
        setCurrentPage(1)
      }

      return response.data as {
        data: BusinessPlanBusinessModelData[]
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getBusinessModelProperties(
        '?prop=specialization',
      )

      if (!response.status) return

      return response.data.data[0]
    },
    placeholderData: previousData => previousData,
  })

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await getBusinessModelProperties()

      if (!response.status) return

      return response.data.data
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
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
    window.scrollTo(0, 0)
    document.title = 'infiniti | Business Models'
  }, [])

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
              {categories.values.map(
                (category: { value: string }, index: number) => {
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
                },
              )}
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
            filters={filters}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setActiveCategory={setActiveCategory}
          />
          <ModelsList
            isAdmin={false}
            setCurrentPage={setCurrentPage}
            modelsList={modelsList}
          />
        </div>
      </section>
    </div>
  )
}
