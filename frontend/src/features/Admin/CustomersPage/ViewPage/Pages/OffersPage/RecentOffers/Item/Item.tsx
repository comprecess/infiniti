import { FC } from 'react'

import { ViewOffersTypeData } from '../../../../../../../../app/constants/constants'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentOffers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  item: ViewOffersTypeData
  navigateToViewOffer: (id: number) => void
  navigateToEditOffer: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  item,
  navigateToViewOffer,
  navigateToEditOffer,
}) => {
  const handleNavigateToViewOffer = () => {
    navigateToViewOffer(item.id)
  }

  const handleNavigateToEditOffer = () => {
    navigateToEditOffer(item.id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {item.id}
      </span>
      <span className={`${styleItem.subjectColumn} ${styles.subjectItem}`}>
        {item.subject}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {item.total}
      </span>
      <span
        className={`${styleItem.dateCreatedColumn} ${styles.dateCreatedItem}`}
      >
        {item.dateCreated}
      </span>
      <span
        className={`${styleItem.dateExpiryColumn} ${styles.dateExpiryItem}`}
      >
        {item.validUntil}
      </span>
      <div className={styleItem.stageColumn}>
        <Status title={item.stage} status={item.stage} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button
          className={styles.buttonView}
          onClick={handleNavigateToViewOffer}
        >
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button
          className={styles.buttonEdit}
          onClick={handleNavigateToEditOffer}
        >
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
