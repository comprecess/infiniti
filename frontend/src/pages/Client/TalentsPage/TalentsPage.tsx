import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
  FiltersData,
  FiltersState,
  page,
  PagesMetaData,
  TalentData,
  userTalentsPageString,
} from '../../../app/constants/constants'
import { CategoriesItem } from '../../../features/Client/CatalogPage/CategoriesItem/CategoriesItem'
import { Filters } from '../../../features/Client/CatalogPage/Filters/Filters'
import { TalentsList } from '../../../features/Client/CatalogPage/TalentsList/TalentsList'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import { getUsersListInfo } from '../../../shared/utils/api/Client/Catalog/User/GetUsersListInfo'
import { getSession } from '../../../shared/utils/Saving/Session/GetSession'
import styles from './TalentsPage.module.scss'

export const ClientTalentsPage = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [sort, setSort] = useState({ name: 'priceDay', type: 'asc' })
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userTalentsPageString) || 1,
  )

  const { data: talentsList } = useQuery({
    queryKey: ['talents', currentPage, selectedFilters, sort],
    queryFn: async () => {
      const res: {
        data: TalentData[]
        meta: PagesMetaData
      } = await getUsersListInfo(
        page + String(currentPage),
        selectedFilters,
        sort,
      )

      if (currentPage > res.meta.last_page) {
        setCurrentPage(1)
      }

      return res
    },
    placeholderData: previousData => previousData,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response: { data: FiltersData[] } =
        await getPropertiesFiltering('?prop=specialization')

      return response.data[0]
    },
    placeholderData: previousData => previousData,
  })

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response: { data: FiltersData[] } =
        await getPropertiesFiltering()

      return response.data
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

    document.title = 'infiniti | Catalog Talents'
  }, [])

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
              {categories.values.map(
                (category: { value: string }, index: number) => {
                  return (
                    <CategoriesItem
                      key={index + 1}
                      name={category.value.replace(/&amp;/g, '&')}
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
            setSelectedFilters={setSelectedFilters}
            setActiveCategory={setActiveCategory}
            setSort={setSort}
            filters={filters}
            selectedFilters={selectedFilters}
          />
          <TalentsList
            sort={sort}
            setSort={setSort}
            setCurrentPage={setCurrentPage}
            talentsList={talentsList}
          />
        </div>
      </section>
    </div>
  )
}
