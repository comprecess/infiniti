import { useEffect, useState } from 'react'

import { ClientInvoiceData } from '../../../app/constants/constants'
import { RecentInvoices } from '../../../features/Client/InvoicesPage/RecentInvoices/RecentInvoices'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceOrOffer } from '../../../shared/utils/api/Client/GetInvoiceOrOffer'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const ClientInvoicesPage = () => {
  const [invoices, setInvoices] = useState<ClientInvoiceData[] | null>(
    null,
  )

  const getInvoiceList = async () => {
    const getResponse = await getInvoiceOrOffer('invoice')

    setInvoices(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Invoices'

    getInvoiceList()
  }, [])

  return (
    <div className={styles.wrapper}>
      {invoices ? (
        <section className={styles.section}>
          <RecentCard
            title={`Total: ${invoices.length}`}
            style={styles.recentFullScreen}
          >
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
