import { FC, useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import {
  ViewInvoicesTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/Header/Header'
import { RecentInvoices } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/RecentInvoices/RecentInvoices'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminContactInvoicesPage: FC = () => {
  const [data, setData] = useState<ViewInvoicesTypeData | null>(null)

  const context = useOutletContext<ViewPageContext>()
  const navigate = useNavigate()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'invoices',
    )

    setData(getResponse)
  }

  const navigateToCreateNewInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.invoice}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Invoices'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            invoiceAmount: data.invoiceAmount,
            paidAmount: data.paidAmount,
            unPaidAmount: data.unpaidAmount,
            onClickButton: navigateToCreateNewInvoice,
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
