import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
  BusinessPlanBusinessModelData,
  FiltersState,
  page,
  PagesMetaData,
  userModelsPageString,
} from '../../../../app/constants/constants'
import { Filters } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBusinessModel } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/DeleteBusinessModel'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetPropertiesFiltering'
import { postBusinessModelList } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/PostBusinessModelList'
import { getSession } from '../../../../shared/utils/Saving/Session/GetSession'
import styles from './BusinessModelsPage.module.scss'

export const AdminBusinessModelsPage = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userModelsPageString) || 1,
  )

  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const { data: modelsList } = useQuery({
    queryKey: ['models', currentPage, selectedFilters],
    queryFn: async () => {
      const res = await postBusinessModelList(
        page + String(currentPage),
        selectedFilters,
      )
      if (currentPage > res.meta.last_page) {
        setCurrentPage(1)
      }

      return res
    },
    staleTime: 5000,
    cacheTime: 300000,
  } as UseQueryOptions)

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      getPropertiesFiltering('?prop=specialization').then(
        res => res.data[0],
      ),
  })

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: () => getPropertiesFiltering().then(res => res.data),
  })

  const handleDeleteBusinessModel = async (id: number) => {
    const response = await deleteBusinessModel(id)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Business Model',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['models'] })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
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
    document.title = 'infiniti | Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Business Models' />
      </div>
      {!categoriesLoading ? (
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
            isAdmin
            setCurrentPage={setCurrentPage}
            deleteBusinessModel={handleDeleteBusinessModel}
            modelsList={
              modelsList as {
                data: BusinessPlanBusinessModelData[]
                meta: PagesMetaData
              }
            }
          />
        </div>
      </section>
    </div>
  )
}
