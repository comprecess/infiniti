import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  SalesInvoiceEmailTemplateData,
  SalesViewInvoiceData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Buttons } from '../../../../features/Admin/Sales/ViewInvoice/Buttons/Buttons'
import { EmailPanel } from '../../../../features/Admin/Sales/ViewInvoice/EmailPanel/EmailPanel'
import { Footer } from '../../../../features/Admin/Sales/ViewInvoice/Footer/Footer'
import { Header } from '../../../../features/Admin/Sales/ViewInvoice/Header/Header'
import { RecentInvoices } from '../../../../features/Admin/Sales/ViewInvoice/RecentInvoices/RecentInvoices'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/GetInfoSelectedInvoice'
import { getInvoiceEmailTemplate } from '../../../../shared/utils/api/Admin/Sales/Invoices/GetEmailTemplate'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewInvoice.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminViewInvoice: FC = () => {
  const [info, setInfo] = useState<SalesViewInvoiceData | null>(null)

  const [emailInfo, setEmailInfo] =
    useState<SalesInvoiceEmailTemplateData | null>(null)
  const [emailTemplate, setEmailTemplate] = useState<string>('')
  const [emailPanel, setEmailPanel] = useState<boolean>(false)

  const id = useIdFromUrl()
  const navigate = useNavigate()

  const openCloseEmailPanel = () => {
    setEmailPanel(!emailPanel)
  }

  const setTemplateEmail = async (
    template:
    | 'invoice-create'
    | 'reminder'
    | 'overdue'
    | 'confirm'
    | 'refund',
  ) => {
    if (template === null || id === null) return

    const getResponse = await getInvoiceEmailTemplate(id, template)

    setEmailTemplate(template)
    setEmailInfo(getResponse)
  }

  const getInvoiceInfo = async () => {
    if (id === null) return

    const getResponse = await getInfoSelectedInvoice(id, '?type=view')

    setInfo(getResponse)
  }

  const navigateToEditInvoice = () => {
    navigate(
      '/' +
        Routes.adminPages +
        '/' +
        Routes.sales +
        '/' +
        Routes.edit +
        '/' +
        Routes.invoice +
        '/' +
        info?.id,
    )
  }

  const navigateToPreviewInvoice = () => {
    const url =
      '/' +
      Routes.public +
      '/' +
      Routes.invoice +
      '/' +
      Routes.view +
      '/' +
      info?.token

    window.open(url, '_blank')
  }

  const interactPDF = async (name: string) => {
    if (!info?.pdf) return

    if (name === 'View PDF') {
      const response = await fetch(info.pdf)

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        window.open(url, '_blank')

        URL.revokeObjectURL(url)
      }
    } else if (name === 'Download PDF') {
      const a = document.createElement('a')

      a.href = info.pdf
      a.download = 'Invoice.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  useEffect(() => {
    document.title = 'infiniti | View Invoice '
  }, [])

  useEffect(() => {
    getInvoiceInfo()
  }, [id])

  useEffect(() => {
    if (emailInfo && emailTemplate) {
      openCloseEmailPanel()
    }
  }, [emailInfo, emailTemplate])

  return (
    <div className={styles.wrapper}>
      {info ? (
        <section className={styles.section}>
          <CustomInput
            readOnly
            title='Unique Invoice URL:'
            type='text'
            name='uniqueURL'
            id='uniqueURL'
            styleInput={styles.input}
            value={`${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${
              Routes.invoice
            }/${Routes.view}/${info.token}`}
            onChange={() => {}}
          />
          <RecentCard
            title='Invoice'
            HeaderComponent={Header}
            Component={Buttons}
            PagesComponent={Footer}
            pagesProps={{
              subtotal: info.blankCalc.price,
              tax: info.blankCalc.tax,
              discount: info.blankCalc.discount,
              grandTotal: info.blankCalc.total,
              note: info.notes,
            }}
            componentProps={{
              statusList: info.listStatus.filter(
                status => status !== info.status,
              ),
              blockEditButton: info.blockEdit,
              editInvoice: navigateToEditInvoice,
              previewInvoice: navigateToPreviewInvoice,
              selectPDF: interactPDF,
              email: setTemplateEmail,
            }}
            headerProps={{
              title: info.title,
              invoiceCode: info.code,
              invoiceDate: info.date,
              dueDate: info.dueDate,
              status: info.status,
              company: info.company,
              totalInvoice: info.blankCalc.total,
              client: info.client,
            }}
          >
            <RecentInvoices blankList={info.blank} />
          </RecentCard>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
      {emailInfo && (
        <EmailPanel
          info={emailInfo}
          modalEmailPanel={emailPanel}
          handleOpenCloseModal={openCloseEmailPanel}
          idInvoice={id}
          template={emailTemplate}
        />
      )}
    </div>
  )
}
