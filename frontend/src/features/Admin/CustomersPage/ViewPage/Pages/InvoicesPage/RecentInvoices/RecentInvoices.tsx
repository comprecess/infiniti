import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'
import {
  RolesAccess,
  ViewInvoicesProps,
} from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'

interface RecentInvoicesProps {
  access: RolesAccess | undefined
  list: ViewInvoicesProps[]
}

export const RecentInvoices = ({ access, list }: RecentInvoicesProps) => {
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
              <Item item={item} access={access} />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
