import { Fragment } from 'react'

import { SalesEditInvoiceBlankData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

interface RecentInvoicesProps {
  blankList: SalesEditInvoiceBlankData[]
}

export const RecentInvoices = ({ blankList }: RecentInvoicesProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Item' style={styles.itemColumn} />
        <Title title='Price' style={styles.priceColumn} />
        <Title title='Quantity' style={styles.qtyColumn} />
        <Title title='Discount' style={styles.discountColumn} />
        <Title title='Total' style={styles.totalColumn} />
      </div>
      <div className={styles.items}>
        {blankList.length > 0 &&
          blankList.map((item, index) => {
            return (
              <Fragment key={item.id}>
                <Item
                  code={item.id}
                  item={item.description}
                  price={item.price}
                  qty={item.amount}
                  discount={item.discount}
                  total={item.total}
                />
                {index !== blankList.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
      </div>
    </div>
  )
}
