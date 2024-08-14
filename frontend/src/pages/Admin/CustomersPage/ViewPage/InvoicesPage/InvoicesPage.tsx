import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewInvoicesTypeData } from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/Header/Header'
import { RecentInvoices } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/RecentInvoices/RecentInvoices'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminContactInvoicesPage: FC = () => {
  const [data, setData] = useState<ViewInvoicesTypeData | null>(null)

  const id = useOutletContext<number>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(id, 'invoices')

    setData(getResponse)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Invoices'
  }, [])

  useEffect(() => {
    getInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            invoiceAmount: data.invoiceAmount,
            paidAmount: data.paidAmount,
            unPaidAmount: data.unpaidAmount,
          }}
        >
          <RecentInvoices list={data.invoice} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
