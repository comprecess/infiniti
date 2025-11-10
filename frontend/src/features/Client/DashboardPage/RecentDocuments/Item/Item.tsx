import styles from './Item.module.scss'
import { ClientDocumentsData } from '../../../../../app/constants/constants'
import { TypeFiles } from '../../../../../shared/ui/TypeFiles/TypeFiles'
import { getAuthToken } from '../../../../../shared/utils/api/get-auth-token'
import styleItem from '../RecentDocuments.module.scss'

interface ItemProps {
  document: ClientDocumentsData
}

export const Item = ({ document }: ItemProps) => {
  const authToken = getAuthToken()

  const handleDownloadFile = async () => {
    const response = await fetch(`${document.link}?token=${authToken}`)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styleItem.typeColumn} ${styles.typeItem}`}>
        <TypeFiles type={document.type} />
      </div>
      <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>{document.title}</span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonDownload} onClick={handleDownloadFile}>
          Download
        </button>
      </div>
    </div>
  )
}
