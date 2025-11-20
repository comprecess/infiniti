import styles from './Item.module.scss'
import { ProjectsViewLogsData } from '../../../../../../../app/constants/constants'
import styleItem from '../LogsTable.module.scss'

interface ItemProps {
  data: ProjectsViewLogsData
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
    </div>
  )
}
