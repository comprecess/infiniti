import saveAs from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'
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
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListSuppliersPage.module.scss'

export const AdminListSuppliersPage: FC = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const [suppliers, setSuppliers] = useState<{
    data: ListCustomersData[]
    meta: PagesMetaData
  } | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?type=Supplier&page=${pageItem}&filter[search]=${searchItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

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
      const urlOptions = `?type=Supplier&page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentFileCustomers(urlOptions)

      if (downloadInitiated instanceof Blob) {
        const contentType = downloadInitiated.type

        if (contentType === 'application/pdf') {
          saveAs(downloadInitiated, 'Suppliers-Infiniti.pdf')
        } else if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          saveAs(downloadInitiated, 'Suppliers-Infiniti.xlsx')
        } else if (contentType === 'text/plain') {
          saveAs(downloadInitiated, 'Suppliers-Infiniti.csv')
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

  const getSuppliers = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: ListCustomersData[]
      meta: PagesMetaData
    } = await getCustomersList(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setSuppliers({ data: getResponse.data, meta: getResponse.meta })
  }

  const deleteSupplier = async (idSupplier: number) => {
    const deleteResponse = await deleteClient(idSupplier)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Supplier',
        status: 'success',
      })
      getSuppliers()
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

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getSuppliers()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {suppliers && access ? (
          <RecentCard
            title='List Suppliers'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            Component={HeaderButtons}
            PagesComponent={PagesList}
            componentProps={{
              isCanCreate: access.create,
              firstButtonClick: navigateToAddSupplier,
            }}
            headerProps={{
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={{
              meta: suppliers.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
          >
            <RecentCustomers
              access={access}
              customersList={suppliers.data}
              deleteClient={deleteSupplier}
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
