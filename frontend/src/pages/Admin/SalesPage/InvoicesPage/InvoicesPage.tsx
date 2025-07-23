import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import { deleteInvoice } from '../../../../shared/utils/api/Admin/Sales/Invoices/DeleteInvoice'
import { getInvoicesDocuments } from '../../../../shared/utils/api/Admin/Sales/Invoices/GetInvoicesDocuments'
import { getList } from '../../../../shared/utils/api/Admin/Sales/Invoices/GetList'
import { getStat } from '../../../../shared/utils/api/Admin/Sales/Invoices/GetStat'
import { stopRecurringAndClone } from '../../../../shared/utils/api/Admin/Sales/Invoices/StopRecurringAndClone'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminInvoicesPage = () => {
  const [page, setPage] = useState<number>(1)
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

  const { data: statsData } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response: SalesInvoicesStatData[] = await getStat()

      return response
    },
    placeholderData: previousData => previousData,
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', page, search, sortName, sortType, filterStatus],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: ViewInvoicesRecentData[]
        meta: PagesMetaData
      } = await getList(
        // eslint-disable-next-line max-len
        `?page=${page}&filter[search]=${search}&filter[status]=${filterStatus}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (page > response.meta.last_page) {
        setPage(1)
      }

      return response
    },
    placeholderData: previousData => previousData,
  })

  const deleteSelectedInvoice = async (idInvoice: number) => {
    const deleteResponse = await deleteInvoice(idInvoice)

    if (deleteResponse.status) {
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
        description: deleteResponse.message,
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
    const stopResponse = await stopRecurringAndClone(idInvoice, type)

    if (stopResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully stopped the recurrence',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    } else {
      showToast({
        title: 'Error',
        description: stopResponse.message,
        status: 'error',
      })
    }
  }

  const downloadFile = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&filter[status]=${filterStatus}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getInvoicesDocuments(urlOptions)

      const { status } = await downloadDocument(
        downloadInitiated,
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
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    document.title = 'infiniti | Invoices'
  }, [])

  useEffect(() => {
    if (filterStatus === null) {
      navigate(`?filterStatus=Unpaid`)
    }
  }, [filterStatus])

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
          PagesComponent={invoicesData ? PagesList : undefined}
          componentProps={{
            access: invoicesData?.access,
            firstButtonClick: navigateToAddInvoice,
          }}
          headerProps={{
            isActiveTab: filterStatus,
            setIsActiveTab: updateFilterStatus,
            searchChange: setSearch,
            rightButtons: downloadFile,
          }}
          pagesProps={
            invoicesData
              ? {
                meta: invoicesData?.meta,
                nextPage: setPage,
                size: 'sm',
              }
              : undefined
          }
        >
          {invoicesData ? (
            <RecentInvoices
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
