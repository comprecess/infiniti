import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './InvoicesPage.module.scss'
import {
  PagesMetaData,
  RolesAccess,
  SalesInvoicesStatData,
  ViewInvoicesRecentData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Blocks } from '../../../../features/Admin/Sales/InvoicesPage/Blocks/Blocks'
import { Header } from '../../../../features/Admin/Sales/InvoicesPage/Header/Header'
import { HeaderButtons } from '../../../../features/Admin/Sales/InvoicesPage/HeaderButtons/HeaderButtons'
import { RecentInvoices } from '../../../../features/Admin/Sales/InvoicesPage/RecentInvoices/RecentInvoices'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteInvoice } from '../../../../shared/utils/api/Admin/Sales/Invoices/delete-invoice'
import { getDocumentsInvoice } from '../../../../shared/utils/api/Admin/Sales/Invoices/get-documents-invoice'
import { getListInvoices } from '../../../../shared/utils/api/Admin/Sales/Invoices/get-list-invoices'
import { getStatInvoices } from '../../../../shared/utils/api/Admin/Sales/Invoices/get-stat-invoices'
import { postCloneStopRecurringInvoice } from '../../../../shared/utils/api/Admin/Sales/Invoices/post-clone-stop-recurring-invoice'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminInvoicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterStatus = searchParams.get('filterStatus') || 'Unpaid'
  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const sortName = searchParams.get('sortName') || 'id'
  const sortType = parseInt(searchParams.get('sortType') || '1')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)
  const updateFilterStatus = (newStatus: string) =>
    updateQueryParam('filterStatus', newStatus)
  const updateSearch = (newSearch: string) =>
    updateQueryParam('search', newSearch)
  const updateSort = (name: string, type: number) => {
    updateQueryParam('sortName', name)
    updateQueryParam('sortType', type)
  }

  const { data: statsData } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await getStatInvoices()

      if (!response.status) return

      return response.data.data as SalesInvoicesStatData[]
    },
    placeholderData: previousData => previousData,
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', page, search, sortName, sortType, filterStatus],
    queryFn: async () => {
      const filterText = filterStatus === 'All' ? '' : filterStatus

      const response = await getListInvoices(
        // eslint-disable-next-line max-len
        `?page=${page}&filter[search]=${search}&filter[status]=${filterText}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (!response.status) return

      if (page && parseInt(page) > response.data.meta.last_page) {
        updatePage('1')
      }

      return response.data as {
        access: RolesAccess
        data: ViewInvoicesRecentData[]
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const deleteSelectedInvoice = async (idInvoice: number) => {
    const { status, message } = await deleteInvoice(idInvoice)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Invoice',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const navigateToSelectInvoice = (idInvoice: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.invoice}/${idInvoice}`,
    )
  }

  const navigateToSelectAccount = (idAccount: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idAccount}/${Routes.summary}`,
    )
  }

  const navigateToViewInvoice = (idInvoice: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${idInvoice}`,
    )
  }

  const navigateToAddInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.invoice}`,
    )
  }

  const stopRecurringInvoice = async (
    idInvoice: number,
    type: '/clone' | '/stopRecurring',
  ) => {
    const { status, message } = await postCloneStopRecurringInvoice(
      idInvoice,
      type,
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully stopped the recurrence',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const downloadFile = useCallback(
    async (documentItem: string) => {
      const filterText = filterStatus === 'All' ? '' : filterStatus

      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&filter[status]=${filterText}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentsInvoice(urlOptions)

      if (!downloadInitiated.status) return

      const { status } = await downloadDocument(
        downloadInitiated.data,
        'Invoices',
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
    [page, search, sortName, sortType, filterStatus],
  )

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let changed = false

    if (!params.has('filterStatus')) {
      params.set('filterStatus', 'Unpaid')
      changed = true
    }

    if (!params.has('page')) {
      params.set('page', '1')
      changed = true
    }

    if (!params.has('sortName')) {
      params.set('sortName', 'id')
      changed = true
    }

    if (!params.has('sortType')) {
      params.set('sortType', '1')
      changed = true
    }

    if (changed) {
      setSearchParams(params, { replace: true })
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Invoices'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Sales' />
      </div>
      <section className={styles.sectionFirst}>
        {statsData ? (
          <div className={styles.blocksList}>
            <div className={styles.blocksContainer}>
              <Blocks
                titleAmount={statsData[0].total}
                status={statsData[0].status}
                percentage={statsData[0].percentage}
                chartBGColor={styles.chartBackGroundFirst}
                blockBGColor={styles.blocksBackGroundFirst}
              />
              <Blocks
                titleAmount={statsData[1].total}
                status={statsData[1].status}
                percentage={statsData[1].percentage}
                chartBGColor={styles.chartBackGroundSecond}
                blockBGColor={styles.blocksBackGroundSecond}
              />
            </div>
            <div className={styles.blocksContainer}>
              <Blocks
                titleAmount={statsData[2].total}
                status={statsData[2].status}
                percentage={statsData[2].percentage}
                chartBGColor={styles.chartBackGroundThird}
                blockBGColor={styles.blocksBackGroundThird}
              />
              <Blocks
                titleAmount={statsData[3].total}
                status={statsData[3].status}
                percentage={statsData[3].percentage}
                chartBGColor={styles.chartBackGroundFourth}
                blockBGColor={styles.blocksBackGroundFourth}
              />
            </div>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <section className={styles.sectionSecond}>
        <RecentCard
          title='Invoices'
          style={styles.recentFullScreen}
          HeaderComponent={Header}
          Component={HeaderButtons}
          PagesComponent={
            invoicesData && invoicesData.data.length > 0
              ? PagesList
              : undefined
          }
          componentProps={{
            access: invoicesData?.access,
            firstButtonClick: navigateToAddInvoice,
          }}
          headerProps={{
            searchValue: search,
            isActiveTab: filterStatus,
            setIsActiveTab: updateFilterStatus,
            searchChange: updateSearch,
            rightButtons: downloadFile,
          }}
          pagesProps={
            invoicesData
              ? {
                meta: invoicesData?.meta,
                nextPage: updatePage,
                size: 'sm',
              }
              : undefined
          }
        >
          {invoicesData ? (
            <RecentInvoices
              access={invoicesData.access}
              invoicesList={invoicesData.data}
              changeSortName={changeSort}
              navigateToViewInvoice={navigateToViewInvoice}
              navigateToSelectInvoice={navigateToSelectInvoice}
              navigateToSelectAccount={navigateToSelectAccount}
              deleteInvoice={deleteSelectedInvoice}
              stopRecurringInvoice={stopRecurringInvoice}
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
