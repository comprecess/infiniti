import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentCarts.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idCustomer: number
  idCart: number
  image: string
  name: string
  specialization: string
  price: string
  date: string
}

export const Item = ({
  idCustomer,
  idCart,
  image,
  name,
  specialization,
  price,
  date,
}: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToCustomer = (name: string) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idCustomer}/${name}`,
    )
  }

  const handleNavigateToCart = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.talents}/${Routes.list}/${Routes.carts}/${Routes.cart}/${idCart}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.imageColumn}>
        <div className={styles.avatar}>
          <img
            alt='Avatar'
            src={
              image
                ? `${image}?width=128&height=128`
                : '/profileWithoutAvatar.svg'
            }
          />
        </div>
      </div>
      <div
        className={`${styleItem.nameColumn} ${styles.nameCodeItem}`}
        onClick={() => handleNavigateToCustomer(Routes.summary)}
      >
        <span className={styles.nameItem}>{name}</span>
      </div>
      <span
        className={`${styleItem.talentsSpecializationColumn} ${styles.specializationItem}`}
      >
        {specialization}
      </span>
      <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>
        {price}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='mint'
          icon='/icons/view.svg'
          alt='View'
          tooltipTitle='View'
          onClick={handleNavigateToCart}
        />
      </div>
    </div>
  )
}
