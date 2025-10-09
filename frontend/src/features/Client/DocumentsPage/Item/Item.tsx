import styles from './Item.module.scss'
import { ClientDocumentsData } from '../../../../app/constants/constants'
import { TypeFiles } from '../../../../shared/ui/TypeFiles/TypeFiles'

interface ItemProps {
  data: ClientDocumentsData
}

export const Item = ({ data }: ItemProps) => {
  const handleDownloadFile = async () => {
    const response = await fetch(data.link)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.wrapper}>
      <TypeFiles type={data.type} />
      <div className={styles.content}>
        <span className={styles.title} onClick={handleDownloadFile}>
          {data.title}
        </span>
        {data.update && (
          <div className={styles.container}>
            <span className={styles.uploadedTitle}>Update at:</span>
            <span className={styles.uploadedValue}>{data.update}</span>
          </div>
        )}
      </div>
    </div>
  )
}
