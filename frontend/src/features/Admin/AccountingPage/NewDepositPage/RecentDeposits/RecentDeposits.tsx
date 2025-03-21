import { Fragment } from 'react'

import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './RecentDeposits.module.scss'

export const RecentDeposits = () => {
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
            <Fragment key={'item.id'}>
              Item
              {index !== [].length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
