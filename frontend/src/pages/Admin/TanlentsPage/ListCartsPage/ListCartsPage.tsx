import { FC, useCallback, useEffect, useState } from 'react'

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

export const AdminListCartsPage: FC = () => {
  const [data, setData] = useState<{
    data: TalentsListCartsData[]
    meta: PagesMetaData
  } | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [filterType, setFilterType] = useState<string>('recently')
  const [options, setOptions] = useState<string>('')

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
    filterTypeItem: string,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?page=${pageItem}&filter[search]=${searchItem}&filter[type]=${filterTypeItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}`

    setOptions(urlOptions)
  }

  const getList = async () => {
    if (!options) return

    const getResponse = await getCartList(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setData(getResponse)
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  const setIsActiveTab = useCallback((name: string) => {
    setFilterType(name)
  }, [])

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  useEffect(() => {
    document.title = 'infiniti | List of Carts'

    getList()
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType, filterType)
  }, [page, search, sortName, sortType, filterType])

  useEffect(() => {
    getList()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data && access ? (
          <RecentCard
            title='List of Carts'
            style={styles.recentFullScreen}
            PagesComponent={data.data.length > 0 ? PagesList : undefined}
            HeaderComponent={Header}
            headerProps={{
              access,
              isActiveTab: filterType,
              setIsActiveTab,
              searchChange: searchOnChange,
            }}
            pagesProps={
              data.data.length > 0
                ? {
                  meta: data.meta,
                  nextPage: pageOnChange,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentCarts
              cartsList={data.data}
              changeSortName={changeSort}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
