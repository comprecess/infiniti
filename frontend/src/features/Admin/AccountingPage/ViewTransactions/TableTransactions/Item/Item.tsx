import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TableTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  date: string
  account: string
  description: string
  dr: string
  cr: string
}

export const Item = ({
  id,
  date,
  account,
  description,
  dr,
  cr,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.idColumn} ${styles.idItem}`}>
        {id}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {description}
      </span>
      <span className={`${styleItem.drColumn} ${styles.drItem}`}>
        {dr}
      </span>
      <span className={`${styleItem.crColumn} ${styles.crItem}`}>
        {cr}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={() => {}}
        />
      </div>
    </div>
  )
}
