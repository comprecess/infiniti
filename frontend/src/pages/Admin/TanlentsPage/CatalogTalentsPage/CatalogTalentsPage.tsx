import { FC, useCallback, useEffect, useState } from 'react'
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
import { deleteSelectedTalent } from '../../../../shared/utils/api/Admin/Talents/DeleteTalent'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import { getUsersListInfo } from '../../../../shared/utils/api/Client/Catalog/User/GetUsersListInfo'
import { getSession } from '../../../../shared/utils/Saving/Session/GetSession'
import styles from './CatalogTalentsPage.module.scss'

export const AdminCatalogTalentsPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [categories, setCategories] = useState<FiltersData | null>(null)
  const [sort, setSort] = useState({ name: 'priceDay', type: 'asc' })
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const [talentsList, setTalentsList] = useState<{
    data: TalentData[]
    meta: PagesMetaData
  } | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userTalentsPageString),
  )

  const [filters, setFilters] = useState<FiltersData[] | null>(null)

  const { t } = useTranslation()

  const showToast = useCustomToast()

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getPropertiesFiltering('?prop=specialization')
      setCategories(data[0])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const fetchTalents = useCallback(async () => {
    try {
      const response = await getUsersListInfo(
        page + String(currentPage),
        selectedFilters,
        sort,
      )

      setTalentsList(response)

      if (currentPage > response.meta.last_page) {
        setCurrentPage(1)
      }
    } catch (error) {
      /* empty */
    }
  }, [currentPage, selectedFilters, sort])

  const deleteTalent = useCallback(
    async (idTalent: number) => {
      const deleteResponse = await deleteSelectedTalent(idTalent)

      if (deleteResponse.status) {
        showToast({
          title: 'Successfully',
          description: 'You have successfully removed the Talent',
          status: 'success',
        })
        fetchTalents()
      } else {
        showToast({
          title: 'Error',
          description: deleteResponse.message,
          status: 'error',
        })
      }
    },
    [fetchTalents],
  )

  const getFilters = useCallback(async () => {
    const filtersAnswer = await getPropertiesFiltering()

    setFilters(filtersAnswer.data)
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

  useEffect(() => {
    fetchTalents()
  }, [fetchTalents])

  useEffect(() => {
    getFilters()
  }, [getFilters])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title={t('admin-catalog-talents-page-title')} />
      </div>
      {categories && talentsList && filters ? (
        <>
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
                {categories.values.map((category, index) => (
                  <CategoriesItem
                    key={index + 1}
                    name={category.value.replace(/&amp;/g, '&')}
                    isActive={activeCategory === index + 1}
                    onClick={() => setActiveCategory(index + 1)}
                  />
                ))}
              </div>
            </div>
          </section>
          <section className={styles.sectionSecond}>
            <div className={styles.itemsSecond}>
              <Filters
                filters={filters}
                setFilters={setFilters}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                setActiveCategory={setActiveCategory}
                setSort={setSort}
              />
              <TalentsList
                talentsList={talentsList}
                sort={sort}
                setSort={setSort}
                deleteTalent={deleteTalent}
                fetchTalents={fetchTalents}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </section>
        </>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
