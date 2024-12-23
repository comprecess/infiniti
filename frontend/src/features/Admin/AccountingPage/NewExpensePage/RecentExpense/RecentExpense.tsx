import React from 'react'

import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './RecentExpense.module.scss'

export const RecentExpense = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Amount' style={styles.amountColumn} />
      </div>
      <div className={styles.items}>
        {[].map((_item, index) => {
          return (
            <React.Fragment key={'item.id'}>
              Item
              {index !== [].length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
