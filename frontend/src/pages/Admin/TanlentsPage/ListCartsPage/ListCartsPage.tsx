import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  PagesMetaData,
  RolesAccess,
  TalentsListCartsData,
} from '../../../../app/constants/constants'
import { Header } from '../../../../features/Admin/TalentsPage/ListOfCartsPage/Header/Header'
import { RecentCarts } from '../../../../features/Admin/TalentsPage/ListOfCartsPage/RecentCarts/RecentCarts'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCartList } from '../../../../shared/utils/api/Admin/Talents/Cart/GetListCart'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListCartsPage.module.scss'

export const AdminListCartsPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [filterType, setFilterType] = useState<string>('recently')

  const { data: listInfo } = useQuery({
    queryKey: ['listOfCart', page, search, sortName, sortType, filterType],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: TalentsListCartsData[]
        meta: PagesMetaData
      } = await getCartList(
        // eslint-disable-next-line max-len
        `?page=${page}&filter[search]=${search}&filter[type]=${filterType}&sort[name]=${sortName}&sort[type]=${sortType}`,
      )

      if (page > response.meta.last_page) {
        setPage(1)
      }

      return response
    },
    placeholderData: previousData => previousData,
  })

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

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
            isActiveTab: filterType,
            setIsActiveTab: setFilterType,
            searchChange: setSearch,
          }}
          pagesProps={
            listInfo && listInfo.data.length > 0
              ? {
                meta: listInfo.meta,
                nextPage: setPage,
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
