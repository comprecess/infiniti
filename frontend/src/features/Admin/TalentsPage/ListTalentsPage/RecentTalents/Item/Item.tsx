import { FC, useState } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { TalentsLevel } from '../../../../../../shared/ui/TalentsLevel/TalentsLevel'
import styleItem from '../RecentTalents.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idTalent: number
  access: RolesAccess
  image: string
  name: string
  specialization: string
  level: string
  priceDay: string
  priceHour: string
  navigateEditTalent: (idTalent: number) => void
  deleteClient: (idSupplier: number) => void
}

export const Item: FC<ItemProps> = ({
  idTalent,
  access,
  image,
  name,
  specialization,
  level,
  priceDay,
  priceHour,
  navigateEditTalent,
  deleteClient,
}) => {
  const [modal, setModal] = useState<boolean>(false)

  const handleSetModal = () => {
    setModal(state => !state)
  }

  const handleEditTalent = () => {
    navigateEditTalent(idTalent)
  }

  const handleDeleteTalent = () => {
    deleteClient(idTalent)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.imageColumn}>
          <img
            src={image ? image : '/profileWithoutAvatar.svg'}
            alt='Avatar'
            className={styles.imageItem}
          />
        </div>
        <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
          {name}
        </span>
        <span
          className={`${styleItem.specializationColumn} ${styles.specializationItem}`}
        >
          {specialization}
        </span>
        <div className={styleItem.levelColumn}>
          <TalentsLevel title={level} />
        </div>
        <span
          className={`${styleItem.priceDayColumn} ${styles.priceDayItem}`}
        >
          {priceDay}
        </span>
        <span
          className={`${styleItem.priceHourColumn} ${styles.priceHourItem}`}
        >
          {priceHour}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <button className={styles.buttonCart} onClick={handleSetModal}>
            <img
              src='/icons/shoppingBasket.svg'
              alt='AddToCart'
              className={styles.icon}
            />
          </button>
          <button className={styles.viewButton}>
            <img
              src='/icons/view.svg'
              alt='View'
              className={styles.icon}
            />
          </button>
          {access.edit === 1 && (
            <button
              className={styles.buttonEdit}
              onClick={handleEditTalent}
            >
              <img
                src='/icons/edit.svg'
                alt='Edit'
                className={styles.icon}
              />
            </button>
          )}
          {access.delete === 1 && (
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
          )}
        </div>
      </div>
      {modal && (
        <ConfirmationModal
          isOpened={modal}
          handleOpenCloseModal={handleSetModal}
          agree={handleDeleteTalent}
        />
      )}
    </>
  )
}
