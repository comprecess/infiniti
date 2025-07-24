import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Header } from '../../../../features/Admin/TalentsPage/ListOfCartsPage/Header/Header'
import { RecentCarts } from '../../../../features/Admin/TalentsPage/ListOfCartsPage/RecentCarts/RecentCarts'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCartList } from '../../../../shared/utils/api/Admin/Talents/Cart/get-cart-list'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListCartsPage.module.scss'

export const AdminListCartsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterStatus = searchParams.get('filterStatus') || 'recently'
  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const sortName = searchParams.get('sortName') || 'id'
  const sortType = parseInt(searchParams.get('sortType') || '1')

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)
  const updateFilterStatus = (newStatus: string) =>
    updateQueryParam('filterStatus', newStatus)
  const updateSearch = (newSearch: string) =>
    updateQueryParam('search', newSearch)
  const updateSort = (name: string, type: number) => {
    updateQueryParam('sortName', name)
    updateQueryParam('sortType', type)
  }

  const { data: listInfo } = useQuery({
    queryKey: [
      'listOfCart',
      page,
      search,
      sortName,
      sortType,
      filterStatus,
    ],
    queryFn: async () => {
      const response = await getCartList(
        // eslint-disable-next-line max-len
        `?page=${page}&filter[search]=${search}&filter[type]=${filterStatus}&sort[name]=${sortName}&sort[type]=${sortType}`,
      )

      if (!response.status) return

      if (page > response.data.meta.last_page) {
        updatePage('1')
      }

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let changed = false

    if (!params.has('filterStatus')) {
      params.set('filterStatus', 'recently')
      changed = true
    }

    if (!params.has('page')) {
      params.set('page', '1')
      changed = true
    }

    if (!params.has('sortName')) {
      params.set('sortName', 'id')
      changed = true
    }

    if (!params.has('sortType')) {
      params.set('sortType', '1')
      changed = true
    }

    if (changed) {
      setSearchParams(params, { replace: true })
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | List of Carts'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='List of Carts'
          style={styles.recentFullScreen}
          HeaderComponent={Header}
          PagesComponent={
            listInfo && listInfo.data.length > 0 ? PagesList : undefined
          }
          headerProps={{
            access:
              listInfo && listInfo.access ? listInfo.access : undefined,
            searchValue: search,
            isActiveTab: filterStatus,
            setIsActiveTab: updateFilterStatus,
            searchChange: updateSearch,
          }}
          pagesProps={
            listInfo && listInfo.data.length > 0
              ? {
                meta: listInfo.meta,
                nextPage: updatePage,
                size: 'sm',
              }
              : undefined
          }
        >
          {listInfo && listInfo.data ? (
            <RecentCarts
              cartsList={listInfo.data}
              changeSortName={changeSort}
            />
          ) : (
            <div className={styles.loading}>
              <LoadingSpinner size='xl' />
            </div>
          )}
        </RecentCard>
      </section>
    </div>
  )
}
