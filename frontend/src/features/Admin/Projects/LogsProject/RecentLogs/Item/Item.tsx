import styles from './Item.module.scss'
import { ProjectsViewLogsData } from '../../../../../../app/constants/constants'
import styleItem from '../RecentLogs.module.scss'

interface ItemProps {
  data: ProjectsViewLogsData
}

export const Item = ({ data }: ItemProps) => {
  const isTimeEntry = data.type === 'addTime' || data.type === 'editTime'
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
        <span>{data.description}</span>
        {isTimeEntry && data.data && (
          <div className={styles.logDetails}>
            {data.data.time && <span className={styles.logDetail}>Duration: {data.data.time}</span>}
            {data.data.task_name && <span className={styles.logDetail}>Task: {data.data.task_name}</span>}
            {data.data.time_entry_id && <span className={styles.logDetail}>Entry ID: {data.data.time_entry_id}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
