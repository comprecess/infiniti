import { useEffect, useState } from 'react'

import styles from './InvoicesPage.module.scss'
import { ClientInvoiceData } from '../../../app/constants/constants'
import { RecentInvoices } from '../../../features/Client/InvoicesPage/RecentInvoices/RecentInvoices'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceOrOffer } from '../../../shared/utils/api/Client/get-invoice-or-offer'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const ClientInvoicesPage = () => {
  const [invoices, setInvoices] = useState<ClientInvoiceData[] | null>(null)

  const getInvoiceList = async () => {
    const response = await getInvoiceOrOffer('invoice')

    if (!response.status) return

    setInvoices(response.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Invoices'

    getInvoiceList()
  }, [])

  return (
    <div className={styles.wrapper}>
      {invoices ? (
        <section className={styles.section}>
          <RecentCard title={`Total: ${invoices.length}`} style={styles.recentFullScreen}>
            <RecentInvoices invoices={invoices} />
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
