import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { ViewInvoicesProps } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

interface RecentInvoicesProps {
  list: ViewInvoicesProps[]
}

export const RecentInvoices = ({ list }: RecentInvoicesProps) => {
  const navigate = useNavigate()

  const navigateToViewInvoice = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${id}`,
    )
  }

  const navigateToEditInvoice = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.invoice}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Invoice Date' style={styles.invoiceDateColumn} />
        <Title title='Due Date' style={styles.dueDateColumn} />
        <Title title='Status' style={styles.statusColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                item={item}
                navigateToViewInvoice={navigateToViewInvoice}
                navigateToEditInvoice={navigateToEditInvoice}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
