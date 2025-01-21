import { useQuery, useQueryClient } from '@tanstack/react-query'
import saveAs from 'file-saver'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  PagesMetaData,
  RolesAccess,
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
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminInvoicesPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('code')
  const [sortType, setSortType] = useState<number>(1)
  const [filterStatus, setFilterStatus] = useState<string>('Unpaid')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await getStat()

      return response
    },
  })

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
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
    staleTime: 5000,
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

  const documentOnChange = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&filter[status]=${filterStatus}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getInvoicesDocuments(urlOptions)

      if (downloadInitiated instanceof Blob) {
        const contentType = downloadInitiated.type

        if (contentType === 'application/pdf') {
          saveAs(downloadInitiated, 'Invoices-Infiniti.pdf')
        } else if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          saveAs(downloadInitiated, 'Invoices-Infiniti.xlsx')
        } else if (contentType === 'text/plain') {
          saveAs(downloadInitiated, 'Invoices-Infiniti.csv')
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Sales' />
      </div>
      <section className={styles.sectionFirst}>
        {!statsLoading ? (
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
            isActiveTab: filterStatus,
            setIsActiveTab: setFilterStatus,
            searchChange: setSearch,
            rightButtons: documentOnChange,
          }}
          pagesProps={
            invoicesData && invoicesData.data.length > 0
              ? {
                meta: invoicesData?.meta,
                nextPage: setPage,
                size: 'sm',
              }
              : undefined
          }
        >
          {!invoicesLoading && invoicesData ? (
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
