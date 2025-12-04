import styles from './Item.module.scss'
import { ResponsiveRow } from '../../../../../shared/ui/ExpandableRow/ResponsiveRow'
import styleItem from '../LatestIncome.module.scss'

interface ItemProps {
  date: string
  amount: string
  description: string
}

export const Item = ({ date, amount, description }: ItemProps) => {
  return (
    <ResponsiveRow
      hiddenFields={[
        {
          label: 'Amount:',
          value: <span className={styles.amountItemMobile}>{amount}</span>,
        },
        {
          label: 'Date:',
          value: <span className={styles.dateItemMobile}>{date}</span>,
        },
      ]}
      visibleFields={[
        {
          label: 'Date',
          value: <span className={styles.dateItem}>{date}</span>,
          className: styleItem.dateColumn,
        },
        {
          label: 'Description',
          value: <span className={styles.descriptionItem}>{description}</span>,
          className: styleItem.descriptionColumn,
        },
        {
          label: 'Amount',
          value: <span className={styles.amountItem}>{amount}</span>,
          className: styleItem.amountColumn,
        },
      ]}
    />
  )
}
