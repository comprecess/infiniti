import React, { FC } from 'react'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentClients.module.scss'

export const RecentClients: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Avatar' style={styles.avatarColumn} />
        <Title title='Name & Email' style={styles.nameEmailColumn} />
        <Title title='Created' style={styles.createdColumn} />
      </div>
      <div className={styles.items}>
        {[].map((_order, index) => {
          return (
            <React.Fragment key={'order.id'}>
              <Item
                avatar={'order.avatar'}
                name={'order.name'}
                email={'order.email'}
                created={'order.created'}
              />
              {index !== [].length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
