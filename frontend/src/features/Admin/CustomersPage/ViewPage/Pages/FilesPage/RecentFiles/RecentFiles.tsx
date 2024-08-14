import React, { FC } from 'react'

import { ViewFileProps } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentFiles.module.scss'

interface RecentFilesProps {
  list: ViewFileProps[]
}

export const RecentFiles: FC<RecentFilesProps> = ({ list }) => {
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
            <React.Fragment key={item.id}>
              <Item type={item.type} title={item.title} />
              {index !== list.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
