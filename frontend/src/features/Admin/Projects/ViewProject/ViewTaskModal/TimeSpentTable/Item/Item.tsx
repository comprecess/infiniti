import styles from './Item.module.scss'
import { ProjectsViewTaskTimeSpentData } from '../../../../../../../app/constants/constants'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TimeSpentTable.module.scss'

interface ItemProps {
  data: ProjectsViewTaskTimeSpentData
}

export const Item = ({ data }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styleItem.avatarColumn} ${styles.avatarItem}`}>
        <div className={styles.avatar}>
          <img
            alt='Avatar'
            src={
              data.user.img ? `${data.user.img}?width=128&height=128` : '/profileWithoutAvatar.svg'
            }
          />
        </div>
      </div>
      <div className={`${styleItem.accountColumn} ${styles.accountItem}`}>{data.user.account}</div>
      <div className={`${styleItem.timeColumn} ${styles.timeItem}`}>
        {`${data.date} / ${data.time}`}
      </div>
      <div className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}>
        {data.description}
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={() => {}}
        />
        <CustomMiniButton
          style='cherry'
          icon='/icons/trash.svg'
          alt='Delete'
          tooltipTitle='Delete'
          onClick={() => {}}
        />
      </div>
    </div>
  )
}
