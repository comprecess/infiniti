import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { addTalentToCart } from '../../../shared/utils/api/Admin/Talents/AddTalentToOrder'
import styles from './Footer.module.scss'
import { Item } from './Item/Item'

interface FooterProps {
  id: number
  inCart?: number
  dailyRate: string
  hourlyRate: string
  isAdmin: boolean
  addTalentInCart?: () => void
  deleteTalent?: (idTalent: number) => void
}

export const Footer: FC<FooterProps> = ({
  id,
  inCart,
  dailyRate,
  hourlyRate,
  isAdmin,
  addTalentInCart,
  deleteTalent,
}) => {
  const [modal, setModal] = useState<boolean>(false)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const handleSetModal = () => {
    setModal(state => !state)
  }

  const handleAddTalentToOrder = async () => {
    const addResponse = await addTalentToCart(id)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added Talent to your cart',
        status: 'success',
      })
      if (addTalentInCart) {
        addTalentInCart()
      }
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const handleNavigateToViewTalent = () => {
    navigate(
      isAdmin
        ? `/${Routes.adminPages}/${Routes.talents}/${Routes.view}/${Routes.talent}/${id}`
        : `/${Routes.clientPages}/${Routes.talents}/${Routes.talent}/${id}`,
    )
  }

  const handleNavigateToEditTalent = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.talents}/${Routes.edit}/${Routes.talent}/${id}`,
    )
  }

  const handleDeleteTalent = () => {
    if (deleteTalent) {
      deleteTalent(id)
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.items}>
          <Item title={dailyRate} description='Daily rate (8h)' />
          <Item title={hourlyRate} description='Hourly rate' />
        </div>
        {isAdmin ? (
          <div className={styles.buttonsContainer}>
            {inCart === 0 && (
              <button
                className={styles.buttonBasket}
                onClick={handleAddTalentToOrder}
              >
                <img
                  src='/icons/shoppingBasket.svg'
                  alt='Basket'
                  className={styles.icon}
                />
              </button>
            )}
            <button
              className={styles.buttonView}
              onClick={handleNavigateToViewTalent}
            >
              <img
                src='/icons/view.svg'
                alt='View'
                className={styles.icon}
              />
            </button>
            <button
              className={styles.buttonEdit}
              onClick={handleNavigateToEditTalent}
            >
              <img
                src='/icons/edit.svg'
                alt='Edit'
                className={styles.icon}
              />
            </button>
            <button
              className={styles.buttonTrash}
              onClick={handleSetModal}
            >
              <img
                src='/icons/trash.svg'
                alt='Trash'
                className={styles.icon}
              />
            </button>
          </div>
        ) : (
          <ButtonBlue
            title='Details'
            onClick={handleNavigateToViewTalent}
          />
        )}
      </div>
      {modal && isAdmin && (
        <ConfirmationModal
          isOpened={modal}
          handleOpenCloseModal={handleSetModal}
          agree={handleDeleteTalent}
        />
      )}
    </>
  )
}
