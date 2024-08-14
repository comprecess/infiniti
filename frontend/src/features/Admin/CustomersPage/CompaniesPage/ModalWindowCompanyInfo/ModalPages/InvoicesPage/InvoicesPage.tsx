import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InvoicesViewCompany } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/GetPage'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import styles from './InvoicesPage.module.scss'
import { Item } from './Item/Item'

interface InvoicesPageProps {
  id: number
}

export const InvoicesPage: FC<InvoicesPageProps> = ({ id }) => {
  const [invoices, setInvoices] = useState<InvoicesViewCompany[] | null>(null)

  const navigate = useNavigate()

  const getInvoices = async () => {
    const getResponse = await getPage(id, 'invoices')

    setInvoices(getResponse.data)
  }

  const handleNavigate = (id: number) => {
    navigate(
      '/' +
        Routes.adminPages +
        '/' +
        Routes.customers +
        '/' +
        Routes.view +
        '/' +
        id +
        '/' +
        Routes.summary,
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
              <Title title='Invoice Date' style={styles.invoiceDateColumn} />
              <Title title='Due Date' style={styles.dueDateColumn} />
              <Title title='Status' style={styles.statusColumn} />
              <Title title='Manage' style={styles.manageColumn} />
            </div>
            <div className={styles.items}>
              {invoices.map((item, index) => {
                return (
                  <React.Fragment key={item.id}>
                    <Item
                      id={item.client.id}
                      code={item.code}
                      customer={item.account}
                      amount={item.total}
                      invoiceDate={item.date}
                      dueDate={item.dueDate}
                      status={item.status}
                      onClick={handleNavigate}
                    />
                    {index !== invoices.length - 1 && <CustomDivider />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  )
}
