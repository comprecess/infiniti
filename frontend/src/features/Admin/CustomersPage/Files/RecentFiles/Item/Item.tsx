import styles from './Item.module.scss'
import { TypeFiles } from '../../../../../../shared/ui/TypeFiles/TypeFiles'
import { downloadOrViewFile } from '../../../../../../shared/utils/usefulMethods'

interface ItemProps {
  title: string
  typeFile: string
  customerId: number | null
  customerName: string | null
  uploadedAt: string | null
  link: string
  navigateToCustomer: (name: string, idTalent: number) => void
}

export const Item = ({
  title,
  typeFile,
  customerId,
  customerName,
  uploadedAt,
  link,
  navigateToCustomer,
}: ItemProps) => {
  const handleNavigateToCustomer = () => {
    if (!customerId) return

    navigateToCustomer('summary', customerId)
  }

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(link)

      if (!response.ok) throw new Error('Ошибка загрузки файла')

      const blob = await response.blob()

      await downloadOrViewFile(blob, title)
    } catch (error) {
      console.error('Не удалось скачать/просмотреть файл', error)
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
          <span className={styles.customerValue} onClick={handleNavigateToCustomer}>
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
