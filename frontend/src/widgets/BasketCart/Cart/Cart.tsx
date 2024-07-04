import React, { FC } from 'react'

import { ItemsCartProps } from '../../../app/constants/constants'
import { Item } from '../../../features/Client/BasketPage/Item/Item'
import { Title } from '../../../features/Main/RecentCard/Title/Title'
import { CrossIcon } from '../../../shared/icons/CrossIcon'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { deleteOrderInCart } from '../../../shared/utils/api/Cart/DeleteOrdernInCart'
import styles from './Cart.module.scss'

interface CartProps {
  cart: ItemsCartProps[]
  onDelete: () => void
}

export const Cart: FC<CartProps> = ({ cart, onDelete }) => {
  const showToast = useCustomToast()

  const handleDelete = async (id: number) => {
    const deleteResponse = await deleteOrderInCart(id)

    if (deleteResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed from the recycle bin',
        status: 'success',
      })

      onDelete()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when deleting from trash',
        status: 'error',
      })
    }
  }

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
        {cart.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                amount={order.amount}
                avatar={order.userCatalog.img}
                nameEmail={order.userCatalog.name}
                profession={order.userCatalog.specialization}
                nameIdType={order.nameIdType}
                taxes={order.taxesInclude}
                taxesAmount={order.taxes}
                total={order.total}
                onDelete={() => handleDelete(order.id)}
              />
              {index !== cart.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
