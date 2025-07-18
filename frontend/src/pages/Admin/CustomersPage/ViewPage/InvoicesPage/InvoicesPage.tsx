import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { ViewPageContext } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/Header/Header'
import { RecentInvoices } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/InvoicesPage/RecentInvoices/RecentInvoices'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './InvoicesPage.module.scss'

export const AdminContactInvoicesPage = () => {
  const context = useOutletContext<ViewPageContext>()
  const navigate = useNavigate()

  const { data: invoices } = useQuery({
    queryKey: ['invoices', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(
        context.idClient,
        'invoices',
      )

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const navigateToCreateNewInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.invoice}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Invoices'
  }, [])

  return (
    <div className={styles.wrapper}>
      {invoices ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            invoiceAmount: invoices.invoiceAmount,
            paidAmount: invoices.paidAmount,
            unPaidAmount: invoices.unpaidAmount,
            onClickButton: navigateToCreateNewInvoice,
          }}
        >
          <RecentInvoices list={invoices.invoice} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
