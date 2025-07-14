import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import {
  PagesMetaData,
  ProjectsExpensesData,
  ProjectViewPageContext,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { RecentExpenses } from '../../../../../features/Admin/Projects/ExpensesProject/RecentExpenses/RecentExpenses'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../../shared/ui/Search/Search'
import { deleteTransaction } from '../../../../../shared/utils/api/Admin/Accounting/DeleteTransaction'
import { getProjectExpenses } from '../../../../../shared/utils/api/Admin/Projects/get-project-expenses'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ExpensesPage.module.scss'

export const AdminProjectsExpensesPage = () => {
  const [data, setData] = useState<{
    access: RolesAccess
    data: ProjectsExpensesData[]
    meta: PagesMetaData
  } | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(0)
  const [options, setOptions] = useState<string>('')

  const context = useOutletContext<ProjectViewPageContext>()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getData = async () => {
    if (!context.idProject || options === '') return

    const response = await getProjectExpenses(context.idProject, options)

    if (!response.status) return

    setData(response.data)
  }

  const handleDeleteExpense = async (id: number) => {
    const { status, message } = await deleteTransaction(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Expense',
        status: 'success',
      })
      getData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    let urlOptions = `?page=${pageItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    if (searchItem !== '') {
      urlOptions += `&filter[search]=${searchItem}`
    }

    setOptions(urlOptions)
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const navigateToCreateNewInvoice = () => {
    navigate(
      // eslint-disable-next-line max-len
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.new}/${Routes.expense}?create-for-project=${context.idProject}`,
    )
  }

  useEffect(() => {
    getData()
  }, [options, context.idProject])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    document.title = 'infiniti | Project Expenses'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data ? (
          <RecentCard
            title='Project Expenses'
            style={styles.recentFullScreen}
            Component={data.access.create ? ButtonBlue : undefined}
            HeaderComponent={Search}
            PagesComponent={data.data.length > 0 ? PagesList : undefined}
            componentProps={
              data.access.create
                ? {
                  titleNone: true,
                  title: 'New Expense',
                  icon: '/icons/plus.svg',
                  style: styles.buttonAddNewExpense,
                  onClick: navigateToCreateNewInvoice,
                }
                : undefined
            }
            headerProps={{
              style: styles.search,
              onSearchChange: setSearch,
            }}
            pagesProps={
              data.data.length > 0
                ? {
                  meta: data.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentExpenses
              expensesList={data.data}
              changeSortName={changeSort}
              deleteExpense={handleDeleteExpense}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
