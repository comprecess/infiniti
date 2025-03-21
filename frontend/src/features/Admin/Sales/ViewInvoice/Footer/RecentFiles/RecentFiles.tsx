import { Fragment } from 'react'

import { SalesViewInvoiceDocuments } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { getAuthToken } from '../../../../../../shared/utils/api/GetAuthToken'
import { Title } from '../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentFiles.module.scss'

interface RecentFilesProps {
  filesList: SalesViewInvoiceDocuments[]
}

export const RecentFiles = ({ filesList }: RecentFilesProps) => {
  const authToken = getAuthToken()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Type' style={styles.typeColumn} />
        <Title title='File' style={styles.fileColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {filesList.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item data={item} authToken={authToken} />
              {index !== filesList.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
