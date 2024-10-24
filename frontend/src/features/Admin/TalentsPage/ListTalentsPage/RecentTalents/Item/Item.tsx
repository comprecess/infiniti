import { FC } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { TalentsLevel } from '../../../../../../shared/ui/TalentsLevel/TalentsLevel'
import styleItem from '../RecentTalents.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  image: string
  name: string
  specialization: string
  level: string
  priceDay: string
  priceHour: string
  navigateEditTalent: (idTalent: number) => void
  navigateToCustomer: (name: string, idTalent: number) => void
  deleteClient: (idSupplier: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  access,
  image,
  name,
  specialization,
  level,
  priceDay,
  priceHour,
  navigateToCustomer,
  navigateEditTalent,
  deleteClient,
}) => {
  const handleNavigateToCustomer = () => {
    navigateToCustomer('summary', id)
  }

  const handleEditTalent = () => {
    navigateEditTalent(id)
  }

  const handleDeleteTalent = () => {
    deleteClient(id)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.imageColumn}>
        <img
          src={image ? image : '/profileWithoutAvatar.svg'}
          alt='Avatar'
          className={styles.imageItem}
        />
      </div>
      <span
        className={`${styleItem.nameColumn} ${styles.nameItem}`}
        onClick={handleNavigateToCustomer}
      >
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
        <button
          className={styles.viewButton}
          onClick={handleNavigateToCustomer}
        >
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        {access.edit === 1 && (
          <button className={styles.buttonEdit} onClick={handleEditTalent}>
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
            onClick={handleDeleteTalent}
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
  )
}
