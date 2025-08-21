import { useState } from 'react'

import { RolesAccess } from '../../../app/constants/constants'
import { Item } from '../../../features/Client/BasketPage/BasketCart/Item/Item'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import styles from './Basket.module.scss'

interface BasketProps {
  isAdmin?: boolean
  access?: RolesAccess
  subtotalCost: string
  taxesAmount: string
  totalPrice: string
  buttonOnClick: () => void
}

export const Basket = ({
  isAdmin = false,
  access,
  subtotalCost,
  taxesAmount,
  totalPrice,
  buttonOnClick,
}: BasketProps) => {
  const [modalConfirm, setModalConfirm] = useState<boolean>(false)

  const handleChangeModalConfirm = () => {
    setModalConfirm(state => !state)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h4 className={styles.title}>Your order</h4>
        <div className={styles.items}>
          <Item title='Subtotal cost' amount={subtotalCost} />
          <Item
            title='Taxes'
            amount={taxesAmount}
            icon='/icons/info.svg'
          />
        </div>
        <CustomDivider />
        <div className={styles.totalOrder}>
          <h5 className={styles.totalPrice}>Total</h5>
          <h5 className={styles.totalPrice}>{totalPrice}</h5>
        </div>
        {isAdmin && (!access || access.create === 1) ? (
          <ButtonBlue
            title='Convert to Offer'
            onClick={handleChangeModalConfirm}
          />
        ) : (
          <div style={{ display: 'none' }} />
        )}
        {!isAdmin && (
          <ButtonBlue
            title='Proceed to checkout'
            onClick={handleChangeModalConfirm}
          />
        )}
      </div>
      {modalConfirm && (
        <ConfirmationModal
          isOpened={modalConfirm}
          handleOpenCloseModal={handleChangeModalConfirm}
          agree={buttonOnClick}
        />
      )}
    </>
  )
}
