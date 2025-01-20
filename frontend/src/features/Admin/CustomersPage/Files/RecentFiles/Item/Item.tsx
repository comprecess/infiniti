import { FC } from 'react'

import { TypeFiles } from '../../../../../../shared/ui/TypeFiles/TypeFiles'
import styles from './Item.module.scss'

interface ItemProps {
  title: string
  typeFile: string
  customerId: number | null
  customerName: string | null
  uploadedAt: string | null
  link: string
  navigateToCustomer: (name: string, idTalent: number) => void
}

export const Item: FC<ItemProps> = ({
  title,
  typeFile,
  customerId,
  customerName,
  uploadedAt,
  link,
  navigateToCustomer,
}) => {
  const handleNavigateToCustomer = () => {
    if (!customerId) return

    navigateToCustomer('summary', customerId)
  }

  const handleDownloadFile = async () => {
    const response = await fetch(link)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <TypeFiles type={typeFile} />
        <span className={styles.title} onClick={handleDownloadFile}>
          {title}
        </span>
      </div>
      {customerId && customerName && (
        <div className={styles.container}>
          <span className={styles.customerTitle}>Customer:</span>
          <span
            className={styles.customerValue}
            onClick={handleNavigateToCustomer}
          >
            {customerName}
          </span>
        </div>
      )}
      {uploadedAt && (
        <div className={styles.container}>
          <span className={styles.uploadedTitle}>Uploaded at:</span>
          <span className={styles.uploadedValue}>{uploadedAt}</span>
        </div>
      )}
    </div>
  )
}
