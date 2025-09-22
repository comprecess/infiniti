import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './ListCustomerPage.module.scss'
import {
  ListCustomersData,
  PagesMetaData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { HeaderButtons } from '../../../../features/Admin/CustomersPage/ListCustomersPage/HeaderButtons/HeaderButtons'
import { RecentCustomers } from '../../../../features/Admin/CustomersPage/ListCustomersPage/RecentCustomers/RecentCustomers'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteCustomerOrSupplier } from '../../../../shared/utils/api/Admin/ListCustomers/delete-customer-or-supplier'
import { getCustomerDocumentFile } from '../../../../shared/utils/api/Admin/ListCustomers/get-customer-document-file'
import { getCustomerOrSupplierList } from '../../../../shared/utils/api/Admin/ListCustomers/get-customer-or-supplier-list'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminListCustomerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const sortName = searchParams.get('sortName') || 'id'
  const sortType = parseInt(searchParams.get('sortType') || '1')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)
  const updateSearch = (newSearch: string) =>
    updateQueryParam('search', newSearch)
  const updateSort = (name: string, type: number) => {
    updateQueryParam('sortName', name)
    updateQueryParam('sortType', type)
  }

  const { data: customers } = useQuery({
    queryKey: ['suppliers', page, search, sortName, sortType],
    queryFn: async () => {
      const response = await getCustomerOrSupplierList(
        `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (!response.status) return

      if (page > response.data.meta.last_page) {
        updatePage('1')
      }

      return response.data as {
        access: RolesAccess
        data: ListCustomersData[]
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

  const downloadFile = useCallback(
    async (documentItem: string) => {
      let urlOptions = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      if (search !== '') {
        urlOptions += `&filter[search]=${search}`
      }

      const downloadInitiated = await getCustomerDocumentFile(urlOptions)

      if (!downloadInitiated.status) return

      const { status } = await downloadDocument(
        downloadInitiated.data,
        'Customers',
      )

      if (status && documentItem === 'copy') {
        showToast({
          title: 'Successfully',
          description:
            'You have successfully copied information to the clipboard',
          status: 'success',
        })
      }
    },
    [page, search, sortName, sortType],
  )

  const deleteCustomer = async (idCustomer: number) => {
    const deleteResponse = await deleteCustomerOrSupplier(idCustomer)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Customer',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const navigateToAddCustomer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.add}/${Routes.customer}`,
    )
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let changed = false

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
    document.title = 'infiniti | Customers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Customers'
          style={styles.recentFullScreen}
          HeaderComponent={SearchAndButtons}
          Component={HeaderButtons}
          PagesComponent={
            customers && customers.data.length > 0 ? PagesList : undefined
          }
          componentProps={{
            access: customers ? customers?.access : undefined,
            firstButtonClick: navigateToAddCustomer,
          }}
          headerProps={{
            searchValue: search,
            searchChange: updateSearch,
            rightButtons: downloadFile,
          }}
          pagesProps={
            customers && customers.data.length > 0
              ? {
                meta: customers.meta,
                nextPage: updatePage,
                size: 'sm',
              }
              : undefined
          }
        >
          {customers ? (
            <RecentCustomers
              access={customers.access}
              customersList={customers.data}
              changeSortName={changeSort}
              deleteClient={deleteCustomer}
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
