import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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

  const [searchParams, setSearchParams] = useSearchParams()
  const filterStatus = searchParams.get('filterStatus')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const updateFilterStatus = (newStatus: string) => {
    searchParams.set('filterStatus', newStatus)
    setSearchParams(searchParams)
  }

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

      return response.data
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
      navigate(`?filterStatus=Summary`)
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
    if (filterStatus === null || filterStatus === '') {
      navigate(`?filterStatus=Summary`)
    }
  }, [filterStatus])

  useEffect(() => {
    if (filterStatus === 'All') {
      setSearch('')
      setSortName('id')
      setSortType(1)
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    } else if (filterStatus === 'Summary') {
      queryClient.invalidateQueries({ queryKey: ['billsDate'] })
    }
    setForm({})
  }, [filterStatus])

  useEffect(() => {
    getInputData()
  }, [])

  const isBillsCreate =
    bills && bills.access.create === 1 && filterStatus === 'Add a Bill'

  return (
    <div className={styles.wrapper}>
      {inputData && bills && billsDate ? (
        <section className={styles.section}>
          <RecentCard
            title='Bills'
            style={styles.recentFullScreen}
            HeaderComponent={Tabs}
            headerProps={{
              access: bills.access,
              isActiveTab: filterStatus,
              setIsActiveTab: updateFilterStatus,
            }}
          >
            {filterStatus === 'Summary' && (
              <SummaryPage
                access={bills.access}
                billsPastDue={billsDate.billsPastDue}
                billsUpcoming={billsDate.billsUpcoming}
                deleteBill={handleDeleteBill}
                isPaidBill={handleIsPaidBill}
              />
            )}
            {filterStatus === 'All' && (
              <AllPage
                bills={bills.data}
                access={bills.access}
                changeSort={changeSort}
                setSearch={setSearch}
                deleteBill={handleDeleteBill}
              />
            )}
            {isBillsCreate && (
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
