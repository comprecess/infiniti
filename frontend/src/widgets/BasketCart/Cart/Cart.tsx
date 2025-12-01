import { Dayjs } from 'dayjs'
import { Fragment, useState } from 'react'

import styles from './Cart.module.scss'
import { ItemsCartProps } from '../../../app/constants/constants'
import { Item } from '../../../features/Client/BasketPage/Item/Item'
import { Title } from '../../../features/Main/RecentCard/Title/Title'
import { CrossIcon } from '../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { postCreateNewMeeting } from '../../../shared/utils/api/Admin/Meeting/post-create-new-meeting'
import { patchChangeCartItem } from '../../../shared/utils/api/Client/Basket/patch-change-cart-item'
import { deleteOrderCart } from '../../../shared/utils/api/Client/Cart/delete-order-cart'
import { getLocalDateTimeString } from '../../../shared/utils/usefulMethods'
import { CreatingCallModal, TimeSlotsById } from '../../CreatingCallModal/CreatingCallModal'

interface CartProps {
  cart: ItemsCartProps[]
  datesEmployment: TimeSlotsById | undefined
  isCreateCall: boolean
  getOrders: () => void
}

export const Cart = ({ cart, datesEmployment, isCreateCall, getOrders }: CartProps) => {
  const [isCreatingCall, setIsCreatingCall] = useState<boolean>(false)

  const showToast = useCustomToast()

  const handleChangeFields = async (idItem: number, data: { [key: string]: number | string }) => {
    const { status, message } = await patchChangeCartItem(idItem, data)

    if (status) {
      getOrders()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleDelete = async (id: number) => {
    const { status, message } = await deleteOrderCart(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed from the recycle bin',
        status: 'success',
      })
      getOrders()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const createMeetingWithCart = async (dates: string[] | null, selectedTime: Dayjs | null) => {
    if (dates === null || selectedTime === null) return

    const time = getLocalDateTimeString()
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const updatedDates = dates.map(dateStr => {
      return `${dateStr} ${selectedTime.format('HH:mm')}`
    })

    const response = await postCreateNewMeeting('cart', updatedDates[0], {
      date: time,
      name: userTimeZone,
    })

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a meeting in Zoom',
        status: 'success',
      })
      setIsCreatingCall(prev => !prev)
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.columns}>
          <Title title='Avatar' style={styles.avatarColumn} />
          <Title title='Name & Email' style={styles.nameEmailColumn} />
          <Title title='Quantity' style={styles.quantityColumn} />
          <Title title='Type' style={styles.typeColumn} />
          <Title title='Taxes' style={styles.taxesColumn} />
          <Title title='Amount' style={styles.amountColumn} />
          <div className={styles.crossColumn}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.items}>
          {cart.map((order, index) => {
            return (
              <Fragment key={order.id}>
                <Item
                  id={order.id}
                  amount={order.amount}
                  avatar={order.userCatalog.img}
                  nameEmail={order.userCatalog.name}
                  profession={order.userCatalog.specialization}
                  nameIdType={order.nameIdType}
                  taxes={order.taxesInclude}
                  taxesAmount={order.taxes}
                  total={order.total}
                  onDelete={() => handleDelete(order.id)}
                  onChangeItem={handleChangeFields}
                />
                {index !== cart.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
          {isCreateCall && cart.length > 0 && (
            <div className={styles.wrapperFirstButton}>
              <div className={styles.wrapperSecondButton}>
                <ButtonBlue
                  title='Create a Call'
                  style={styles.buttonCreateCall}
                  onClick={() => setIsCreatingCall(prev => !prev)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {datesEmployment && (
        <CreatingCallModal
          isOpen={isCreatingCall}
          datesEmployment={datesEmployment}
          onClose={() => setIsCreatingCall(prev => !prev)}
          onClick={createMeetingWithCart}
        />
      )}
    </>
  )
}
