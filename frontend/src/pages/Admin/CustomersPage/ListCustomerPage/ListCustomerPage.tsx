import { saveAs } from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ListCustomersData,
  PagesMetaData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { HeaderButtons } from '../../../../features/Admin/CustomersPage/ListCustomersPage/HeaderButtons/HeaderButtons'
import { RecentCustomers } from '../../../../features/Admin/CustomersPage/ListCustomersPage/RecentCustomers/RecentCustomers'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDocumentFileCustomers } from '../../../../shared/utils/api/Admin/ListCustomers/GetDocumentFileCustomers'
import { getCustomersList } from '../../../../shared/utils/api/Admin/ListCustomers/GetListCustomers'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListCustomerPage.module.scss'

export const AdminListCustomerPage: FC = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const [customers, setCustomers] = useState<{
    data: ListCustomersData[]
    meta: PagesMetaData
  } | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?page=${pageItem}&filter[search]=${searchItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    setOptions(urlOptions)
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const documentOnChange = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentFileCustomers(urlOptions)

      if (downloadInitiated instanceof Blob) {
        const contentType = downloadInitiated.type

        if (contentType === 'application/pdf') {
          saveAs(downloadInitiated, 'Customers-Infiniti.pdf')
        } else if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          saveAs(downloadInitiated, 'Customers-Infiniti.xlsx')
        } else if (contentType === 'text/plain') {
          saveAs(downloadInitiated, 'Customers-Infiniti.csv')
        } else if (contentType === 'text/html') {
          const htmlText = await downloadInitiated.text()
          await navigator.clipboard.writeText(htmlText)
          showToast({
            title: 'Successfully',
            description:
              'You have successfully copied information to the clipboard',
            status: 'success',
          })
        }
      }
    },
    [page, search, sortName, sortType],
  )

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  const getCustomers = async () => {
    if (!options) return

    const getResponse = await getCustomersList(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setCustomers(getResponse)
  }

  const navigateToAddCustomer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.add}/${Routes.customer}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | List Customer'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getCustomers()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {customers ? (
          <RecentCard
            title='List Customers'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            Component={HeaderButtons}
            componentProps={{ firstButtonClick: navigateToAddCustomer }}
            PagesComponent={PagesList}
            headerProps={{
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={{
              meta: customers.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
          >
            <RecentCustomers
              customersList={customers.data}
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
