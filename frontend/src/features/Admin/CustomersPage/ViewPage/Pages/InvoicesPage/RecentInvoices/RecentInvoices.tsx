import { Fragment } from 'react'

import { ViewInvoicesProps } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

interface RecentInvoicesProps {
  list: ViewInvoicesProps[]
}

export const RecentInvoices = ({ list }: RecentInvoicesProps) => {
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
              <Item item={item} />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
