import { useQuery } from '@tanstack/react-query'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  BusinessPlanBusinessModelData,
  FiltersState,
  PagesMetaData,
} from '../../../app/constants/constants'
import { Filters } from '../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { CategoriesItem } from '../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessModelProperties } from '../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-properties'
import { getBusinessModelsList } from '../../../shared/utils/api/Client/BusinessModels/get-business-models-list'
import styles from './BusinessModelsPage.module.scss'

export const ClientBusinessModelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))
    if (key !== 'page') {
      newParams.set('page', '1')
    }
    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)

  const selectedFilters = useMemo<FiltersState>(() => {
    const filtersFromURL: FiltersState = {}
    for (const [key, val] of searchParams.entries()) {
      const match = key.match(/^filter\[(.+?)\]\[\]$/)
      if (match) {
        const propId = match[1]
        if (!filtersFromURL[propId]) filtersFromURL[propId] = []
        filtersFromURL[propId].push(Number(val))
      }
    }

    return filtersFromURL
  }, [searchParams])

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

  const activeCategory = useMemo(() => {
    if (!categories || categories.id === undefined) return 0
    const categoryKey = categories.id.toString()
    const values = selectedFilters[categoryKey] || []
    if (values.length === 0) return 0
    const firstValueIndex = categories.values.findIndex(
      (v: { id: string | number | null }) => v.id === values[0],
    )

    return firstValueIndex >= 0 ? firstValueIndex + 1 : 0
  }, [categories, selectedFilters])

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await getBusinessModelProperties()

      if (!response.status) return

      return response.data.data
    },
    placeholderData: previousData => previousData,
  })

  const { data: modelsList } = useQuery({
    queryKey: ['client-models', window.location.search],
    queryFn: async () => {
      const response = await getBusinessModelsList(
        window.location.search.toString(),
      )

      if (!response.status) return

      if (parseInt(page) > response.data.meta.last_page) updatePage('1')

      return response.data as {
        data: BusinessPlanBusinessModelData[]
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const updateFilters: Dispatch<SetStateAction<FiltersState>> = value => {
    const newFilters =
      typeof value === 'function' ? value(selectedFilters) : value
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      for (const key of Array.from(params.keys())) {
        if (key.startsWith('filter[')) params.delete(key)
      }
      Object.entries(newFilters).forEach(([propId, values]) => {
        values.forEach(v => {
          params.append(`filter[${propId}][]`, String(v))
        })
      })
      params.set('page', '1')

      return params
    })
  }

  const updateActiveCategory: Dispatch<SetStateAction<number>> = value => {
    const index =
      typeof value === 'function' ? value(activeCategory) : value
    if (!categories || categories.id === undefined) return
    const categoryKey = categories.id.toString()
    const newFilters = { ...selectedFilters }
    if (index === 0) {
      delete newFilters[categoryKey]
    } else {
      const categoryValue = categories.values[index - 1]?.id
      if (categoryValue !== undefined) {
        newFilters[categoryKey] = [categoryValue]
      }
    }
    updateFilters(newFilters)
  }

  useLayoutEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      if (!params.has('page')) params.set('page', '1')

      return params
    })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)

    document.title = 'infiniti | Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.backButton}>
        <BackButton />
      </div>
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
                onClick={() => updateActiveCategory(0)}
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
                      onClick={() => updateActiveCategory(index + 1)}
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
            setSelectedFilters={updateFilters}
            setActiveCategory={updateActiveCategory}
          />
          <ModelsList
            isAdmin={false}
            modelsList={modelsList}
            setCurrentPage={value => {
              const p = typeof value === 'function' ? value(0) : value
              updatePage(p.toString())
            }}
          />
        </div>
      </section>
    </div>
  )
}
