import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import styles from './CatalogTalentsPage.module.scss'
import {
  FiltersState,
  PagesMetaData,
  RolesAccess,
  TalentData,
} from '../../../../app/constants/constants'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { Filters } from '../../../../features/Admin/TalentsPage/CatalogTalents/Filters/Filters'
import { TalentsList } from '../../../../features/Admin/TalentsPage/CatalogTalents/TalentsList/TalentsList'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteSelectedTalent } from '../../../../shared/utils/api/Admin/Talents/delete-selected-talent'
import { getTalentsList } from '../../../../shared/utils/api/Admin/Talents/get-talents-list'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Client/Catalog/Properties/get-properties-filtering'

export const AdminCatalogTalentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const sortName = searchParams.get('sort[name]') || 'priceDay'
  const sortType = searchParams.get('sort[type]') || 'asc'
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
  const updateSort = (name: string, type: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('sort[name]', name)
      newParams.set('sort[type]', type)

      return newParams
    })
  }

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
      const response = await getPropertiesFiltering('?prop=specialization')

      if (!response.status) return

      return response.data.data[0]
    },
    placeholderData: prev => prev,
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
      const response = await getPropertiesFiltering()

      if (!response.status) return

      return response.data.data
    },
    placeholderData: prev => prev,
  })

  const { data: talentsList, refetch } = useQuery({
    queryKey: ['admin-talents', window.location.search],
    queryFn: async () => {
      const response = await getTalentsList(window.location.search.toString())

      if (!response.status) return

      if (parseInt(page) > response.data.meta.last_page) updatePage('1')

      return response.data as {
        access: RolesAccess
        data: TalentData[]
        meta: PagesMetaData
      }
    },
    placeholderData: prev => prev,
  })

  const updateFilters: Dispatch<SetStateAction<FiltersState>> = value => {
    const newFilters = typeof value === 'function' ? value(selectedFilters) : value
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
    const index = typeof value === 'function' ? value(activeCategory) : value
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
      if (!params.has('sort[name]')) params.set('sort[name]', 'priceDay')
      if (!params.has('sort[type]')) params.set('sort[type]', 'asc')

      return params
    })
  }, [])

  const deleteTalent = async (id: number) => {
    const { status, message } = await deleteSelectedTalent(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed Talent',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['admin-talents'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    document.title = 'infiniti | Talents Catalogue'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title={t('admin-catalog-talents-page-title')} />
      </div>
      {categories ? (
        <section className={styles.sectionFirst}>
          <div className={styles.itemsFirst}>
            <span className={styles.categoriesText}>{t('admin-catalog-talents-page-text-1')}</span>
            <div className={styles.categories}>
              <CategoriesItem
                name={t('admin-catalog-talents-page-text-5')}
                isActive={activeCategory === 0}
                onClick={() => updateActiveCategory(0)}
              />
              {categories.values.map((category: { value: string }, index: number) => (
                <CategoriesItem
                  key={index + 1}
                  name={category.value.replace(/&amp;/g, '&')}
                  isActive={activeCategory === index + 1}
                  onClick={() => updateActiveCategory(index + 1)}
                />
              ))}
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
            setSort={value => {
              const newSort =
                typeof value === 'function' ? value({ name: sortName, type: sortType }) : value
              updateSort(newSort.name, newSort.type)
            }}
          />
          <TalentsList
            sort={{ name: sortName, type: sortType }}
            deleteTalent={deleteTalent}
            fetchTalents={refetch}
            talentsList={talentsList}
            setSort={value => {
              const newSort =
                typeof value === 'function' ? value({ name: sortName, type: sortType }) : value
              updateSort(newSort.name, newSort.type)
            }}
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
