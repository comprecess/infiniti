import { AccountingBillsData } from '../../../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './SummaryPage.module.scss'

interface SummaryPageProps {
  billsPastDue: AccountingBillsData[]
  billsUpcoming: AccountingBillsData[]
  deleteBill: (idBill: number) => void
  isPaidBill: (idBill: number) => void
}

export const SummaryPage = ({
  billsPastDue,
  billsUpcoming,
  deleteBill,
  isPaidBill,
}: SummaryPageProps) => {
  if (billsPastDue.length === 0 && billsUpcoming.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {billsUpcoming.length > 0 && (
        <div className={styles.container}>
          <div className={styles.title}>Upcoming Bills</div>
          <div className={styles.content}>
            {billsUpcoming.map(upcoming => (
              <Item
                key={upcoming.id}
                data={upcoming}
                deleteBill={deleteBill}
                isPaidBill={isPaidBill}
              />
            ))}
          </div>
        </div>
      )}
      {billsPastDue.length > 0 && (
        <div className={styles.container}>
          <div className={styles.title}>Past Due Bills</div>
          <div className={styles.content}>
            {billsPastDue.map(upcoming => (
              <Item
                key={upcoming.id}
                data={upcoming}
                deleteBill={deleteBill}
                isPaidBill={isPaidBill}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
