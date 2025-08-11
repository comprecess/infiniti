import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  InvoicesViewCompany,
  RolesAccess,
} from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import styles from './InvoicesPage.module.scss'
import { Item } from './Item/Item'

interface InvoicesPageProps {
  id: number
  roles?: { [key: string]: RolesAccess }
}

export const InvoicesPage = ({ id, roles }: InvoicesPageProps) => {
  const [invoices, setInvoices] = useState<InvoicesViewCompany[] | null>(
    null,
  )

  const navigate = useNavigate()

  const getInvoices = async () => {
    const response = await getCompanyPage(id, 'invoices')

    if (!response.status) return

    setInvoices(response.data.data)
  }

  const handleNavigate = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${Routes.summary}`,
    )
  }

  useEffect(() => {
    getInvoices()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {invoices ? (
          <div className={styles.table}>
            <div className={styles.columns}>
              <Title title='#' style={styles.hashTagColumn} />
              <Title title='Customer' style={styles.customerColumn} />
              <Title title='Amount' style={styles.amountColumn} />
              <Title
                title='Invoice Date'
                style={styles.invoiceDateColumn}
              />
              <Title title='Due Date' style={styles.dueDateColumn} />
              <Title title='Status' style={styles.statusColumn} />
              <Title title='Manage' style={styles.manageColumn} />
            </div>
            <div className={styles.items}>
              {invoices.map((item, index) => {
                return (
                  <Fragment key={item.id}>
                    <Item
                      id={item.client.id}
                      roles={roles}
                      idInvoice={item.id}
                      code={item.code}
                      customer={item.account}
                      amount={item.total}
                      invoiceDate={item.date}
                      dueDate={item.dueDate}
                      status={item.status}
                      onClick={handleNavigate}
                    />
                    {index !== invoices.length - 1 && <CustomDivider />}
                  </Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}
