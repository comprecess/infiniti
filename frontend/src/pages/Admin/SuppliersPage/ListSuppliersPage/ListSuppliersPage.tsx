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
import { RecentCustomers } from '../../../../features/Admin/CustomersPage/ListCustomersPage/RecentCustomers/RecentCustomers'
import { HeaderButtons } from '../../../../features/Admin/ListSuppliersPage/HeaderButtons/HeaderButtons'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteClient } from '../../../../shared/utils/api/Admin/ListCustomers/DeleteClient'
import { getDocumentFileCustomers } from '../../../../shared/utils/api/Admin/ListCustomers/GetDocumentFileCustomers'
import { getCustomersList } from '../../../../shared/utils/api/Admin/ListCustomers/GetListCustomers'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListSuppliersPage.module.scss'

export const AdminListSuppliersPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers', page, search, sortName, sortType],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: ListCustomersData[]
        meta: PagesMetaData
      } = await getCustomersList(
        // eslint-disable-next-line max-len
        `?type=Supplier&page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
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
      const urlOptions = `?type=Supplier&page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentFileCustomers(urlOptions)

      const { status } = await downloadDocument(
        downloadInitiated,
        'Suppliers',
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

  const deleteSupplier = async (idSupplier: number) => {
    const deleteResponse = await deleteClient(idSupplier)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Supplier',
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

  const navigateToAddSupplier = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.suppliers}/${Routes.add}/${Routes.supplier}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | List Suppliers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='List Suppliers'
          style={styles.recentFullScreen}
          HeaderComponent={SearchAndButtons}
          Component={HeaderButtons}
          PagesComponent={suppliers ? PagesList : undefined}
          componentProps={{
            access: suppliers?.access,
            firstButtonClick: navigateToAddSupplier,
          }}
          headerProps={{
            searchChange: setSearch,
            rightButtons: downloadFile,
          }}
          pagesProps={
            suppliers
              ? {
                meta: suppliers.meta,
                nextPage: setPage,
                size: 'sm',
              }
              : undefined
          }
        >
          {suppliers ? (
            <RecentCustomers
              access={suppliers.access}
              customersList={suppliers.data}
              deleteClient={deleteSupplier}
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
