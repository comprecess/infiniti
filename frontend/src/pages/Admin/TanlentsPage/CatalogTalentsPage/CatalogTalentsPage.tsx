import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
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
import { deleteSelectedTalent } from '../../../../shared/utils/api/Admin/Talents/DeleteTalent'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import { getUsersListInfo } from '../../../../shared/utils/api/Client/Catalog/User/GetUsersListInfo'
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

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      getPropertiesFiltering('?prop=specialization').then(
        res => res.data[0],
      ),
  })

  const { data: talentsList, refetch } = useQuery({
    queryKey: ['talents', currentPage, selectedFilters, sort],
    queryFn: async () => {
      const res = await getUsersListInfo(
        page + String(currentPage),
        selectedFilters,
        sort,
      )
      if (currentPage > res.meta.last_page) {
        setCurrentPage(1)
      }

      return res
    },
    staleTime: 5000,
    cacheTime: 300000,
  } as UseQueryOptions)

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: () => getPropertiesFiltering().then(res => res.data),
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
      {!categoriesLoading ? (
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
            talentsList={
              talentsList as {
                data: TalentData[]
                meta: PagesMetaData
              }
            }
          />
        </div>
      </section>
    </div>
  )
}
