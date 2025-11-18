import styles from './Item.module.scss'
import { SalesViewInvoiceDocuments } from '../../../../../../../app/constants/constants'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TypeFiles } from '../../../../../../../shared/ui/TypeFiles/TypeFiles'
import { downloadOrViewFile } from '../../../../../../../shared/utils/usefulMethods'
import styleItem from '../RecentFiles.module.scss'

interface ItemProps {
  data: SalesViewInvoiceDocuments
  authToken: string | undefined
}

export const Item = ({ data, authToken }: ItemProps) => {
  const handleDownloadFile = async (link: string) => {
    const headers: HeadersInit = data.global === 0 ? { Authorization: `Bearer ${authToken}` } : {}

    try {
      const response = await fetch(link, { headers })

      if (!response.ok) throw new Error('Ошибка загрузки файла')

      const blob = await response.blob()

      await downloadOrViewFile(blob, data.title)
    } catch (error) {
      console.error('Не удалось скачать/просмотреть файл', error)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.typeColumn}>
        <TypeFiles type={data.type} />
      </div>
      <span className={`${styleItem.fileColumn} ${styles.fileItem}`}>{data.title}</span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='mint'
          icon='/icons/fileDownload.svg'
          alt='Download File'
          tooltipTitle='Download File'
          onClick={() => handleDownloadFile(data.link)}
        />
      </div>
    </div>
  )
}
