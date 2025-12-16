import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './InvoicesPage.module.scss'
import {
  PagesMetaData,
  ProjectViewPageContext,
  ViewInvoicesRecentData,
} from '../../../../../app/constants/constants'
import { RecentInvoices } from '../../../../../features/Admin/Projects/InvoicesProject/RecentInvoices/RecentInvoices'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../../shared/ui/Search/Search'
import { getProjectInvoices } from '../../../../../shared/utils/api/Client/Projects/get-project-invoices'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const ClientProjectsInvoicesPage = () => {
  const [data, setData] = useState<{
    data: ViewInvoicesRecentData[]
    meta: PagesMetaData
  } | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const context = useOutletContext<ProjectViewPageContext>()

  const getData = async () => {
    if (!context.idProject || options === '') return

    const response = await getProjectInvoices(context.idProject, options)

    if (!response.status) return

    setData(response.data)
  }

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    let urlOptions = `?page=${pageItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    if (searchItem !== '') {
      urlOptions += `&filter[search]=${searchItem}`
    }

    setOptions(urlOptions)
  }

  const changeSort = useCallback((sortNameItem: string, sortTypeItem: number) => {
    setSortName(sortNameItem)
    setSortType(sortTypeItem)
  }, [])

  useEffect(() => {
    getData()
  }, [options, context.idProject])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    document.title = 'infiniti | Project Invoices'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data ? (
          <RecentCard
            title='Project Invoices'
            style={styles.recentFullScreen}
            HeaderComponent={Search}
            PagesComponent={data.data.length > 0 ? PagesList : undefined}
            headerProps={{
              style: styles.search,
              onSearchChange: setSearch,
            }}
            pagesProps={
              data.data.length > 0
                ? {
                  meta: data.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentInvoices
              isClientView
              access={{ all: 0, view: 0, create: 0, edit: 0, delete: 0 }}
              invoicesList={data.data}
              changeSortName={changeSort}
              deleteInvoice={() => {}}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
