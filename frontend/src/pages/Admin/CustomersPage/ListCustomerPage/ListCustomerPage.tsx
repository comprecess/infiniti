import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { deleteClient } from '../../../../shared/utils/api/Admin/ListCustomers/DeleteClient'
import { getDocumentFileCustomers } from '../../../../shared/utils/api/Admin/ListCustomers/GetDocumentFileCustomers'
import { getCustomersList } from '../../../../shared/utils/api/Admin/ListCustomers/GetListCustomers'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListCustomerPage.module.scss'

export const AdminListCustomerPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: customers } = useQuery({
    queryKey: ['suppliers', page, search, sortName, sortType],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: ListCustomersData[]
        meta: PagesMetaData
      } = await getCustomersList(
        `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
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

  const downloadFile = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentFileCustomers(urlOptions)

      const { status } = await downloadDocument(
        downloadInitiated,
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
    const deleteResponse = await deleteClient(idCustomer)

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
    document.title = 'infiniti | List Customers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='List Customers'
          style={styles.recentFullScreen}
          HeaderComponent={SearchAndButtons}
          Component={HeaderButtons}
          PagesComponent={customers ? PagesList : undefined}
          componentProps={{
            access: customers?.access,
            firstButtonClick: navigateToAddCustomer,
          }}
          headerProps={{
            searchChange: setSearch,
            rightButtons: downloadFile,
          }}
          pagesProps={
            customers
              ? {
                meta: customers.meta,
                nextPage: setPage,
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
