import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { ProfileInfo } from '../../../app/data/general/profile'
import { Item } from '../../../features/Client/BasketPage/Item/Item'
import { Title } from '../../../features/Main/RecentCard/Title/Title'
import { CrossIcon } from '../../../shared/icons/CrossIcon'
import styles from './Cart.module.scss'

export const Cart: FC = () => {
  const handleDelete = () => {}

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Avatar' style={styles.avatarColumn} />
        <Title title='Name & Email' style={styles.nameEmailColumn} />
        <Title title='Quantity' style={styles.quantityColumn} />
        <Title title='Taxes' style={styles.taxesColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <div className={styles.crossColumn}>
          <CrossIcon />
        </div>
      </div>
      <div className={styles.items}>
        {ProfileInfo.carts.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                avatar={order.avatar}
                nameEmail={order.nameEmail}
                profession={order.profession}
                quantity={order.quantity}
                taxes={order.taxes}
                taxesAmount={order.taxesAmount}
                amount={order.amount}
                onDelete={() => handleDelete()}
              />
              {index !== ProfileInfo.carts.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
