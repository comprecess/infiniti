import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { SalesViewInvoiceData } from '../../../app/constants/constants'
import { RecentInvoices } from '../../../features/Admin/Sales/ViewInvoice/RecentInvoices/RecentInvoices'
import { Footer } from '../../../features/General/InvoiceViewPage/Footer/Footer'
import { Header } from '../../../features/General/InvoiceViewPage/Header/Header'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoPublicInvoice } from '../../../shared/utils/api/Admin/Sales/PublicInvoice/GetInfoPublicInvoice'
import { postStripePayment } from '../../../shared/utils/api/Admin/Sales/PublicInvoice/PostStripePayment'
import styles from './InvoiceViewPage.module.scss'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/view\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractTokenFromUrl(location.pathname),
    [location.pathname],
  )
}

export const InvoiceViewPage: FC = () => {
  const [info, setInfo] = useState<SalesViewInvoiceData | null>(null)

  const showToast = useCustomToast()
  const token = useTokenFromUrl()

  const getInvoiceInfo = async () => {
    if (token === null) return

    const getResponse = await getInfoPublicInvoice(token, '?type=view')

    setInfo(getResponse)
  }

  const postNavigateToStripe = async () => {
    if (token === null) return

    const tokenResponse: {
      url: string
      status: boolean
      message?: string
    } = await postStripePayment(token)

    if (tokenResponse.status) {
      window.location.href = tokenResponse.url
    } else {
      showToast({
        title: 'Error',
        description: `${tokenResponse.message}`,
        status: 'error',
      })
    }
  }

  const viewPDF = async () => {
    if (!info?.pdf) return

    const response = await fetch(info.pdf)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  const downloadPDF = () => {
    if (!info?.pdf) return

    const a = document.createElement('a')

    a.href = info.pdf
    a.download = 'Invoice.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  useEffect(() => {
    document.title = 'Infiniti | Preview Invoice'
  }, [])

  useEffect(() => {
    getInvoiceInfo()
  }, [token])

  return (
    <div className={styles.wrapper}>
      {info ? (
        <div className={styles.container}>
          <div className={styles.pdfButtons}>
            <ButtonBlue
              title='Download PDF'
              style={styles.downloadPDF}
              onClick={downloadPDF}
            />
            <ButtonBlue
              title='View PDF'
              style={styles.viewPDF}
              onClick={viewPDF}
            />
          </div>
          <div className={styles.header}>
            <Header
              token={token}
              title={info.title}
              invoiceCode={info.code}
              invoiceDate={info.date}
              dueDate={info.dueDate}
              status={info.status}
              checkPublic={info.checkPublic === 1 ? true : false}
              totalInvoice={info.blankCalc.total}
              client={info.client}
              company={info.company}
              offer={info.offer}
              payList={info.payList}
              postNavigateToStripe={postNavigateToStripe}
            />
          </div>
          <div className={styles.table}>
            <div className={styles.tableContent}>
              <RecentInvoices blankList={info.blank} />
            </div>
          </div>
          <div className={styles.footer}>
            <Footer
              subtotal={info.blankCalc.price}
              tax={info.blankCalc.tax}
              discount={info.blankCalc.discount}
              grandTotal={info.blankCalc.total}
              note={info.notes}
              transactions={info.transactions}
              documents={info.documents}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
