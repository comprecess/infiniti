import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  AccountingBillsForm,
  AccountingInputData,
} from '../../../../app/constants/constants'
import { AddABillPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AddABillPage/AddABillPage'
import { AllPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/AllPage/AllPage'
import { SummaryPage } from '../../../../features/Admin/AccountingPage/Bills/Pages/SummaryPage/SummaryPage'
import { Tabs } from '../../../../features/Admin/AccountingPage/Bills/Tabs/Tabs'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBill } from '../../../../shared/utils/api/Admin/Accounting/delete-bill'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getAllBillsList } from '../../../../shared/utils/api/Admin/Accounting/get-all-bills-list'
import { getBillsDate } from '../../../../shared/utils/api/Admin/Accounting/get-bills-date'
import { postCreateNewBill } from '../../../../shared/utils/api/Admin/Accounting/post-create-new-bill'
import { putIsPaidBill } from '../../../../shared/utils/api/Admin/Accounting/put-is-paid-bill'
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
    const response = await getAccountingInputData('Expense')

    if (!response.status) return

    setInputData(response.data)
  }

  const { data: bills } = useQuery({
    queryKey: ['bills', search, sortName, sortType],
    queryFn: async () => {
      const response = await getAllBillsList(
        search === ''
          ? `?sort[name]=${sortName}&sort[type]=${sortType}`
          : `?filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}`,
      )

      if (!response.status) return

      return response.data.data
    },
    placeholderData: previousData => previousData,
  })

  const { data: billsDate } = useQuery({
    queryKey: ['billsDate'],
    queryFn: async () => {
      const response = await getBillsDate()

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const addNewBill = async () => {
    const { status, message } = await postCreateNewBill(form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Bill',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
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
      setSortName('id')
      setSortType(1)
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    } else if (pages === 'Summary') {
      queryClient.invalidateQueries({ queryKey: ['billsDate'] })
    }
    setForm({})
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
