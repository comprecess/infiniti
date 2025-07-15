import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  AccountingBillsData,
  AccountingBillsForm,
  AccountingInputData,
} from '../../../../app/constants/constants'
import { AddABillPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AddABillPage/AddABillPage'
import { AllPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AllPage/AllPage'
import { SummaryPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/SummaryPage/SummaryPage'
import { Tabs } from '../../../../features/Admin/AccountingPage/Bills/Tabs/Tabs'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBill } from '../../../../shared/utils/api/Admin/Accounting/DeleteBill'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAccountingInputData'
import { getAllBillsList } from '../../../../shared/utils/api/Admin/Accounting/GetAllBillsList'
import { getBillsDate } from '../../../../shared/utils/api/Admin/Accounting/GetBillsDate'
import { postAddNewBill } from '../../../../shared/utils/api/Admin/Accounting/PostAddNewBill'
import { putIsPaidBill } from '../../../../shared/utils/api/Admin/Accounting/PutIsPaidBill'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './BillsPage.module.scss'

export const AdminBillsPage = () => {
  const [form, setForm] = useState<Partial<AccountingBillsForm>>({})
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)

  const [pages, setPages] = useState<string>('Summary')

  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const getInputData = async () => {
    const response: AccountingInputData = await getAccountingInputData(
      'Expense',
    )

    setInputData(response)
  }

  const { data: bills } = useQuery({
    queryKey: ['bills', search, sortName, sortType],
    queryFn: async () => {
      const response: { data: AccountingBillsData[] } =
        await getAllBillsList(
          search === ''
            ? `?sort[name]=${sortName}&sort[type]=${sortType}`
            : `?filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}`,
        )

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const { data: billsDate } = useQuery({
    queryKey: ['billsDate'],
    queryFn: async () => {
      const response: {
        billsPastDue: AccountingBillsData[]
        billsUpcoming: AccountingBillsData[]
      } = await getBillsDate()

      return response
    },
    placeholderData: previousData => previousData,
  })

  const addNewBill = async () => {
    const response = await postAddNewBill(form)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Bill',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  const handleDeleteBill = async (idBill: number) => {
    const response = await deleteBill(idBill)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Bill',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  const handleIsPaidBill = async (idBill: number) => {
    const response = await putIsPaidBill(idBill)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Bill status.',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['billsDate'] })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
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
    document.title = 'infiniti | Bills'
  }, [])

  useEffect(() => {
    if (pages === 'All') {
      setSearch('')
      setSortName('title')
      setSortType(0)
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    } else if (pages === 'Summary') {
      queryClient.invalidateQueries({ queryKey: ['billsDate'] })
    }
  }, [pages])

  useEffect(() => {
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData && bills && billsDate ? (
        <section className={styles.section}>
          <RecentCard
            title='Bills'
            style={styles.recentFullScreen}
            HeaderComponent={Tabs}
            headerProps={{ isActiveTab: pages, setIsActiveTab: setPages }}
          >
            {pages === 'Summary' && (
              <SummaryPage
                billsPastDue={billsDate.billsPastDue}
                billsUpcoming={billsDate.billsUpcoming}
                deleteBill={handleDeleteBill}
                isPaidBill={handleIsPaidBill}
              />
            )}
            {pages === 'All' && (
              <AllPage
                bills={bills}
                changeSort={changeSort}
                setSearch={setSearch}
                deleteBill={handleDeleteBill}
              />
            )}
            {pages === 'Add a Bill' && (
              <AddABillPage
                inputData={inputData}
                setForm={setForm}
                addNewBill={addNewBill}
              />
            )}
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
