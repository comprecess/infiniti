import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentDocuments.module.scss'
import { ClientDocumentsData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentDocumentsProps {
  documents: ClientDocumentsData[]
}

export const RecentDocuments = ({ documents }: RecentDocumentsProps) => {
  if (documents.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Type' style={styles.typeColumn} />
        <Title title='Title' style={styles.titleColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {documents.map((document, index) => {
          return (
            <Fragment key={index}>
              <Item document={document} />
              {index !== documents.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
