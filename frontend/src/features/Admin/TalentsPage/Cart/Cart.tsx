import { Dayjs } from 'dayjs'
import { Fragment, useState } from 'react'

import styles from './Cart.module.scss'
import { Item } from './Item/Item'
import { CartItem } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { postCreateNewMeeting } from '../../../../shared/utils/api/Admin/Meeting/post-create-new-meeting'
import { deleteCart } from '../../../../shared/utils/api/Admin/Talents/Cart/delete-cart'
import { putChangeField } from '../../../../shared/utils/api/Admin/Talents/Cart/put-change-field'
import { getLocalDateTimeString } from '../../../../shared/utils/usefulMethods'
import {
  CreatingCallModal,
  TimeSlotsById,
} from '../../../../widgets/CreatingCallModal/CreatingCallModal'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface CartProps {
  idCart: number
  cart: CartItem[]
  datesEmployment: TimeSlotsById | undefined
  getOrders: () => void
}

export const Cart = ({
  idCart,
  cart,
  datesEmployment,
  getOrders,
}: CartProps) => {
  const [isCreatingCall, setIsCreatingCall] = useState<boolean>(false)

  const showToast = useCustomToast()

  const handleChangeFields = async (
    idCart: number,
    idItem: number,
    data: { [key: string]: number | string },
  ) => {
    const changeResponse = await putChangeField(idCart, idItem, data)

    if (changeResponse.status) {
      getOrders()
    } else {
      showToast({
        title: 'Error',
        description: changeResponse.message,
        status: 'error',
      })
    }
  }

  const handleDelete = async (id: number) => {
    const deleteResponse = await deleteCart(idCart, id)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed Talent from the order',
        status: 'success',
      })
      getOrders()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const createMeetingWithCart = async (
    dates: string[] | null,
    selectedTime: Dayjs | null,
  ) => {
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
          <Title title='Image' style={styles.avatarColumn} />
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
                  idCart={idCart}
                  idItem={order.id}
                  amount={order.amount}
                  avatar={order.talent?.img}
                  nameEmail={order.talent.name}
                  profession={order.talent.specialization}
                  nameIdType={order.nameType}
                  taxes={order.taxesInclude}
                  taxesAmount={order.tax}
                  total={order.total}
                  onDelete={() => handleDelete(order.id)}
                  onChangeItem={handleChangeFields}
                />
                {index !== cart.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
          {cart.length > 0 && (
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
