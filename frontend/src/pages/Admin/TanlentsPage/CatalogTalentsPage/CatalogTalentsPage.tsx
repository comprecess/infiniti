import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  FiltersData,
  FiltersState,
  page,
  PagesMetaData,
  TalentData,
  userTalentsPageString,
} from '../../../../app/constants/constants'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { Filters } from '../../../../features/Admin/TalentsPage/CatalogTalents/Filters/Filters'
import { TalentsList } from '../../../../features/Admin/TalentsPage/CatalogTalents/TalentsList/TalentsList'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteSelectedTalent } from '../../../../shared/utils/api/Admin/Talents/delete-selected-talent'
import { postTalentsList } from '../../../../shared/utils/api/Admin/Talents/post-talents-list'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import { getSession } from '../../../../shared/utils/Saving/Session/GetSession'
import styles from './CatalogTalentsPage.module.scss'

export const AdminCatalogTalentsPage = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [sort, setSort] = useState({ name: 'priceDay', type: 'asc' })
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userTalentsPageString) || 1,
  )

  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const { data: talentsList, refetch } = useQuery({
    queryKey: ['talents', currentPage, selectedFilters, sort],
    queryFn: async () => {
      const response = await postTalentsList(
        page + String(currentPage),
        selectedFilters,
        sort,
      )

      if (!response.status) return

      if (currentPage > response.data.meta.last_page) {
        setCurrentPage(1)
      }

      return response.data as {
        data: TalentData[]
        meta: PagesMetaData
      }
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

  const deleteTalent = async (idTalent: number) => {
    const deleteResponse = await deleteSelectedTalent(idTalent)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed the Talent',
        status: 'success',
      })

      queryClient.invalidateQueries({ queryKey: ['talents'] })
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

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
        <TitlePage title={t('admin-catalog-talents-page-title')} />
      </div>
      {categories ? (
        <section className={styles.sectionFirst}>
          <div className={styles.itemsFirst}>
            <span className={styles.categoriesText}>
              {t('admin-catalog-talents-page-text-1')}
            </span>
            <div className={styles.categories}>
              <CategoriesItem
                name={t('admin-catalog-talents-page-text-5')}
                isActive={activeCategory === 0}
                onClick={() => setActiveCategory(0)}
              />
              {categories.values.map(
                (category: { value: string }, index: number) => (
                  <CategoriesItem
                    key={index + 1}
                    name={category.value.replace(/&amp;/g, '&')}
                    isActive={activeCategory === index + 1}
                    onClick={() => setActiveCategory(index + 1)}
                  />
                ),
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
            setSort={setSort}
          />
          <TalentsList
            sort={sort}
            setSort={setSort}
            deleteTalent={deleteTalent}
            setCurrentPage={setCurrentPage}
            fetchTalents={refetch}
            talentsList={talentsList}
          />
        </div>
      </section>
    </div>
  )
}
