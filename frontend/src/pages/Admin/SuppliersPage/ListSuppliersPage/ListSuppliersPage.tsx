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
import { deleteCustomerOrSupplier } from '../../../../shared/utils/api/Admin/ListCustomers/delete-customer-or-supplier'
import { getCustomerDocumentFile } from '../../../../shared/utils/api/Admin/ListCustomers/get-customer-document-file'
import { getCustomerOrSupplierList } from '../../../../shared/utils/api/Admin/ListCustomers/get-customer-or-supplier-list'
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
      const response = await getCustomerOrSupplierList(
        // eslint-disable-next-line max-len
        `?type=Supplier&page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (!response.status) return

      if (page > response.data.meta.last_page) {
        setPage(1)
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
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const downloadFile = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      let urlOptions = `?type=Supplier&page=${page}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      if (search !== '') {
        urlOptions += `&filter[search]=${search}`
      }

      const downloadInitiated = await getCustomerDocumentFile(urlOptions)

      if (!downloadInitiated.status) return

      const { status } = await downloadDocument(
        downloadInitiated.data,
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
    const deleteResponse = await deleteCustomerOrSupplier(idSupplier)

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
