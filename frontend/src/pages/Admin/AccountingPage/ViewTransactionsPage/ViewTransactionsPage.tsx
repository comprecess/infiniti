import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  AccountingInputData,
  AccountingTransactionsData,
  PagesMetaData,
} from '../../../../app/constants/constants'
import { Filters } from '../../../../features/Admin/AccountingPage/ViewTransactions/Filters/Filters'
import { TableTransactions } from '../../../../features/Admin/AccountingPage/ViewTransactions/TableTransactions/TableTransactions'
import { RecentRightButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentRightButtons/RecentRightButtons'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAccountingInputData'
import { getListTransactions } from '../../../../shared/utils/api/Admin/Accounting/GetListTransactions'
import { getTransactionsDocuments } from '../../../../shared/utils/api/Admin/Accounting/GetTransactionsDocuments'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewTransactionsPage.module.scss'

export const AdminViewTransactionsPage = () => {
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const [page, setPage] = useState<number>(1)
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(0)

  const [filterType, setFilterType] = useState<string>('')
  const [filterAccount, setFilterAccount] = useState<string>('')
  const [filterContact, setFilterContact] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  const showToast = useCustomToast()

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

      const response: {
        data: AccountingTransactionsData[]
        meta: PagesMetaData
      } = await getListTransactions(query)

      return response
    },
    placeholderData: previousData => previousData,
  })

  const getInputData = async () => {
    const response: AccountingInputData = await getAccountingInputData(
      'Expense',
    )

    setInputData(response)
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

      const { status } = await downloadDocument(
        downloadInitiated,
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
    [page, sortName, sortType, filterType],
  )

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

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
            HeaderComponent={RecentRightButtons}
            PagesComponent={viewTransactions ? PagesList : undefined}
            headerProps={{
              rightButtons: downloadFile,
            }}
            pagesProps={
              viewTransactions
                ? {
                  meta: viewTransactions?.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <TableTransactions
              transactions={viewTransactions.data}
              changeSort={changeSort}
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
