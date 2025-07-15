import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import {
  PagesMetaData,
  ProjectViewPageContext,
  RolesAccess,
  ViewInvoicesRecentData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { RecentInvoices } from '../../../../../features/Admin/Projects/InvoicesProject/RecentInvoices/RecentInvoices'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../../shared/ui/Search/Search'
import { getProjectInvoices } from '../../../../../shared/utils/api/Admin/Projects/get-project-invoices'
import { deleteInvoice } from '../../../../../shared/utils/api/Admin/Sales/Invoices/DeleteInvoice'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminProjectsInvoicesPage = () => {
  const [data, setData] = useState<{
    access: RolesAccess
    data: ViewInvoicesRecentData[]
    meta: PagesMetaData
  } | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const context = useOutletContext<ProjectViewPageContext>()

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getData = async () => {
    if (!context.idProject || options === '') return

    const response = await getProjectInvoices(context.idProject, options)

    if (!response.status) return

    setData(response.data)
  }

  const deleteSelectedInvoice = async (idInvoice: number) => {
    const { status, message } = await deleteInvoice(idInvoice)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Invoice',
        status: 'success',
      })
      getData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
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

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const navigateToCreateNewInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.invoice}?create-for-project=${context.idProject}`,
    )
  }

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
            Component={data.access.create ? ButtonBlue : undefined}
            HeaderComponent={Search}
            PagesComponent={data.data.length > 0 ? PagesList : undefined}
            componentProps={
              data.access.create
                ? {
                  titleNone: true,
                  title: 'New Invoice',
                  icon: '/icons/plus.svg',
                  style: styles.buttonAddNewInvoice,
                  onClick: navigateToCreateNewInvoice,
                }
                : undefined
            }
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
              invoicesList={data.data}
              changeSortName={changeSort}
              deleteInvoice={deleteSelectedInvoice}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
