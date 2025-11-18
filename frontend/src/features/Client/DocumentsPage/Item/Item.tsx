import styles from './Item.module.scss'
import { ClientDocumentsData } from '../../../../app/constants/constants'
import { TypeFiles } from '../../../../shared/ui/TypeFiles/TypeFiles'
import { getAuthToken } from '../../../../shared/utils/api/get-auth-token'
import { downloadOrViewFile } from '../../../../shared/utils/usefulMethods'

interface ItemProps {
  data: ClientDocumentsData
}

export const Item = ({ data }: ItemProps) => {
  const authToken = getAuthToken()

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(`${data.link}?token=${authToken}`)

      if (!response.ok) throw new Error('Ошибка загрузки файла')

      const blob = await response.blob()

      await downloadOrViewFile(blob, data.title)
    } catch (error) {
      console.error('Не удалось скачать/просмотреть файл', error)
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
