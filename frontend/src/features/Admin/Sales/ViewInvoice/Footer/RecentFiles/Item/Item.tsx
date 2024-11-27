import { FC } from 'react'

import { SalesViewInvoiceDocuments } from '../../../../../../../app/constants/constants'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TypeFiles } from '../../../../../../../shared/ui/TypeFiles/TypeFiles'
import styleItem from '../RecentFiles.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  data: SalesViewInvoiceDocuments
  authToken: string | undefined
}

export const Item: FC<ItemProps> = ({ data, authToken }) => {
  const handleDownloadFile = async (link: string) => {
    const headers: HeadersInit =
      data.global === 0
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {}

    const response = await fetch(link, { headers })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.typeColumn}>
        <TypeFiles type={data.type} />
      </div>
      <span className={`${styleItem.fileColumn} ${styles.fileItem}`}>
        {data.title}
      </span>
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
