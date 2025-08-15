import { Fragment } from 'react'

import {
  RolesAccess,
  ViewTransactionsTypeData,
} from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTransactions.module.scss'

interface RecentTransactionsProps {
  access: RolesAccess | undefined
  list: ViewTransactionsTypeData[]
}

export const RecentTransactions = ({
  access,
  list,
}: RecentTransactionsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Date' style={styles.dateColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Type' style={styles.typeColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Dr.	' style={styles.drColumn} />
        <Title title='Cr.' style={styles.crColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item {...item} access={access} />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
