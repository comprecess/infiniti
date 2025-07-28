import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../OffersPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  idOffer: number
  code: number
  account: string
  subject: string
  total: string
  dateCreated: string
  validUntil: string
  stage: string
  onClick: (id: number) => void
}

export const Item = ({
  id,
  idOffer,
  code,
  account,
  subject,
  total,
  dateCreated,
  validUntil,
  stage,
  onClick,
}: ItemProps) => {
  const navigate = useNavigate()

  const onClickItem = () => {
    onClick(id)
  }

  const handleNavigateToViewOffer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.offer}/${Routes.view}/${idOffer}`,
    )
  }

  const handleNavigateToEditOffer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.offer}/${idOffer}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {code}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.customerItem}`}
        onClick={onClickItem}
      >
        {account}
      </span>
      <span className={`${styleItem.subjectColumn} ${styles.subjectItem}`}>
        {subject}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {total}
      </span>
      <span
        className={`${styleItem.dateCreatedColumn} ${styles.dateCreatedItem}`}
      >
        {dateCreated}
      </span>
      <span
        className={`${styleItem.expiryDateColumn} ${styles.expiryDateItem}`}
      >
        {validUntil}
      </span>
      <div className={styleItem.stageColumn}>
        <Status title={stage} status={stage} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='mint'
          icon='/icons/view.svg'
          alt='View'
          tooltipTitle='View'
          onClick={handleNavigateToViewOffer}
        />
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={handleNavigateToEditOffer}
        />
      </div>
    </div>
  )
}
