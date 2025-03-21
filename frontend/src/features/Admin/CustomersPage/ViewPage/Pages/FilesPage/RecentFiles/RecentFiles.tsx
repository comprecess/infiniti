import { Fragment } from 'react'

import { ViewFileProps } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentFiles.module.scss'

interface RecentFilesProps {
  list: ViewFileProps[]
  deleteFile: (idType: number) => void
}

export const RecentFiles = ({ list, deleteFile }: RecentFilesProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Type' style={styles.typeColumn} />
        <Title title='Title' style={styles.titleColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                idType={item.id}
                type={item.type}
                title={item.title}
                deleteFile={deleteFile}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
