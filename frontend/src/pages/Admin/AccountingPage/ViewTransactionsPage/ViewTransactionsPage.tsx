import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  AccountingInputData,
  AccountingTransactionsData,
  PagesMetaData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Filters } from '../../../../features/Admin/AccountingPage/ViewTransactions/Filters/Filters'
import { TableTransactions } from '../../../../features/Admin/AccountingPage/ViewTransactions/TableTransactions/TableTransactions'
import { RecentRightButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentRightButtons/RecentRightButtons'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteTransaction } from '../../../../shared/utils/api/Admin/Accounting/delete-transaction'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getTransactionsDocuments } from '../../../../shared/utils/api/Admin/Accounting/get-transaction-documents'
import { getTransactionsList } from '../../../../shared/utils/api/Admin/Accounting/get-transactions-list'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewTransactionsPage.module.scss'

export const AdminViewTransactionsPage = () => {
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const [page, setPage] = useState<number>(1)
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)

  const [filterType, setFilterType] = useState<string>('')
  const [filterAccount, setFilterAccount] = useState<string>('')
  const [filterContact, setFilterContact] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: viewTransactions } = useQuery({
    queryKey: [
      'viewTransactionsList',
      page,
      sortName,
      sortType,
      filterType,
      filterAccount,
      filterContact,
      filterCategory,
      filterDateFrom,
      filterDateTo,
    ],
    queryFn: async () => {
      let query = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}`

      if (filterType !== '') {
        query += `&filter[type]=${filterType}`
      }
      if (filterAccount !== '') {
        query += `&filter[account]=${filterAccount}`
      }
      if (filterContact !== '') {
        query += `&filter[client]=${filterContact}`
      }
      if (filterCategory !== '') {
        query += `&filter[category]=${filterCategory}`
      }
      if (filterDateFrom !== '') {
        query += `&filter[date][0]=${filterDateFrom}`
      }
      if (filterDateTo !== '') {
        query += `&filter[date][1]=${filterDateTo}`
      }

      const response = await getTransactionsList(query)

      if (!response.status) return

      return response.data as {
        data: AccountingTransactionsData[]
        access: RolesAccess
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const getInputData = async () => {
    const response = await getAccountingInputData('Income')

    if (!response.status) return

    setInputData(response.data)
  }

  const downloadFile = useCallback(
    async (documentItem: string) => {
      let query = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      if (filterType !== '') {
        query += `&filter[type]=${filterType}`
      }
      if (filterAccount !== '') {
        query += `&filter[account]=${filterAccount}`
      }
      if (filterContact !== '') {
        query += `&filter[client]=${filterContact}`
      }
      if (filterCategory !== '') {
        query += `&filter[category]=${filterCategory}`
      }
      if (filterDateFrom !== '') {
        query += `&filter[date][0]=${filterDateFrom}`
      }
      if (filterDateTo !== '') {
        query += `&filter[date][1]=${filterDateTo}`
      }

      const downloadInitiated = await getTransactionsDocuments(query)

      if (!downloadInitiated.status) return

      const { status } = await downloadDocument(
        downloadInitiated.data,
        'Transactions',
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
    [
      page,
      sortName,
      sortType,
      filterType,
      filterAccount,
      filterContact,
      filterCategory,
      filterDateFrom,
      filterDateTo,
    ],
  )

  const handleDeleteTransaction = async (id: number) => {
    const { status, message } = await deleteTransaction(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Transaction',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['viewTransactionsList'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    setPage(1)
  }, [
    filterType,
    filterAccount,
    filterContact,
    filterCategory,
    filterDateFrom,
    filterDateTo,
  ])

  useEffect(() => {
    document.title = 'infiniti | View Transactions'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData && viewTransactions ? (
        <section className={styles.section}>
          <RecentCard title='Filter Transactions' style={styles.cardFirst}>
            <Filters
              inputData={inputData}
              setFilterType={setFilterType}
              setFilterAccount={setFilterAccount}
              setFilterContact={setFilterContact}
              setFilterCategory={setFilterCategory}
              setFilterDateFrom={setFilterDateFrom}
              setFilterDateTo={setFilterDateTo}
            />
          </RecentCard>
          <RecentCard
            style={styles.cardSecond}
            title='View Transactions'
            HeaderComponent={
              viewTransactions.data.length > 0
                ? RecentRightButtons
                : undefined
            }
            PagesComponent={
              viewTransactions.data.length > 0 ? PagesList : undefined
            }
            headerProps={
              viewTransactions.data.length > 0
                ? {
                  rightButtons: downloadFile,
                }
                : undefined
            }
            pagesProps={
              viewTransactions.data.length > 0
                ? {
                  meta: viewTransactions?.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <TableTransactions
              access={viewTransactions.access}
              transactions={viewTransactions.data}
              changeSort={changeSort}
              deleteTransaction={handleDeleteTransaction}
            />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
