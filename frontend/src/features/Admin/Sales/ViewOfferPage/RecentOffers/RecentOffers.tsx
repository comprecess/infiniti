import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'
import { SalesEditInvoiceBlankData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentOffersProps {
  blankList: SalesEditInvoiceBlankData[]
}

export const RecentOffers = ({ blankList }: RecentOffersProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Item' style={styles.descriptionColumn} />
        <Title title='Price' style={styles.priceColumn} />
        <Title title='Quantity' style={styles.quantityColumn} />
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
                  description={item.description}
                  price={item.price}
                  quantity={item.amount}
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
