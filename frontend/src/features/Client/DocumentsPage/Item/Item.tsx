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
      // Ensure the link is a full URL - if it's just a token, prepend the API base
      const fullLink = data.link.startsWith('http')
        ? data.link
        : `${import.meta.env.VITE_MAIN_DOMAIN}${import.meta.env.VITE_GET_DOCUMENT}/${data.link}`
      const response = await fetch(fullLink, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (!response.ok) throw new Error('File download error')
      const blob = await response.blob()
      await downloadOrViewFile(blob, data.title)
    } catch (error) {
      console.error('Failed to download/view file', error)
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
