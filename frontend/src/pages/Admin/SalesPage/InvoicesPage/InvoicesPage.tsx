import saveAs from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminInvoicesPage: FC = () => {
  const [stat, setStat] = useState<SalesInvoicesStatData[] | null>(null)
  const [list, setList] = useState<{
    data: ViewInvoicesRecentData[]
    meta: PagesMetaData
  } | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('code')
  const [sortType, setSortType] = useState<number>(1)
  const [filterStatus, setFilterStatus] = useState<string>('Unpaid')
  const [options, setOptions] = useState<string>('')

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
    filterStatusItem: string,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?page=${pageItem}&filter[search]=${searchItem}&filter[status]=${filterStatusItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    setOptions(urlOptions)
  }

  const getStatInvoice = async () => {
    const getResponse = await getStat()

    setStat(getResponse)
  }

  const getListInvoice = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: ViewInvoicesRecentData[]
      meta: PagesMetaData
    } = await getList(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setList(getResponse)
  }

  const deleteSelectedInvoice = async (idInvoice: number) => {
    const deleteResponse = await deleteInvoice(idInvoice)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Invoice',
        status: 'success',
      })
      getStatInvoice()
      getListInvoice()
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

  const setIsActiveTab = useCallback((name: string) => {
    setFilterStatus(name)
  }, [])

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

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
      getListInvoice()
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
    getStatInvoice()

    document.title = 'infiniti | Invoices'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType, filterStatus)
  }, [page, search, sortName, sortType, filterStatus])

  useEffect(() => {
    getListInvoice()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Sales' />
      </div>
      <section className={styles.sectionFirst}>
        {stat ? (
          <div className={styles.blocksList}>
            <div className={styles.blocksContainer}>
              <Blocks
                titleAmount={stat[0].total}
                status={stat[0].status}
                percentage={stat[0].percentage}
                chartBGColor={styles.chartBackGroundFirst}
                blockBGColor={styles.blocksBackGroundFirst}
              />
              <Blocks
                titleAmount={stat[1].total}
                status={stat[1].status}
                percentage={stat[1].percentage}
                chartBGColor={styles.chartBackGroundSecond}
                blockBGColor={styles.blocksBackGroundSecond}
              />
            </div>
            <div className={styles.blocksContainer}>
              <Blocks
                titleAmount={stat[2].total}
                status={stat[2].status}
                percentage={stat[2].percentage}
                chartBGColor={styles.chartBackGroundThird}
                blockBGColor={styles.blocksBackGroundThird}
              />
              <Blocks
                titleAmount={stat[3].total}
                status={stat[3].status}
                percentage={stat[3].percentage}
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
        {list && access ? (
          <RecentCard
            title='Invoices'
            style={styles.recentFullScreen}
            HeaderComponent={Header}
            Component={HeaderButtons}
            PagesComponent={list.data.length > 0 ? PagesList : undefined}
            componentProps={{
              access,
              firstButtonClick: navigateToAddInvoice,
            }}
            headerProps={{
              isActiveTab: filterStatus,
              setIsActiveTab,
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={
              list.data.length > 0
                ? {
                  meta: list.meta,
                  nextPage: pageOnChange,
                  size: 'sm',
                }
                : undefined
            }
          >
            {list ? (
              <RecentInvoices
                invoicesList={list.data}
                changeSortName={changeSort}
                navigateToViewInvoice={navigateToViewInvoice}
                navigateToSelectInvoice={navigateToSelectInvoice}
                navigateToSelectAccount={navigateToSelectAccount}
                deleteInvoice={deleteSelectedInvoice}
                stopRecurringInvoice={stopRecurringInvoice}
              />
            ) : (
              <LoadingSpinner size='xl' />
            )}
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
