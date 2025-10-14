import { useNavigate } from 'react-router-dom'

import styles from './ViewItem.module.scss'
import { ClientTicketsData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Status } from '../../../../shared/ui/Status/Status'

interface ViewItemProps {
  data: ClientTicketsData
}

export const ViewItem = ({ data }: ViewItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToViewTicket = () => {
    navigate(`/${Routes.clientPages}/${Routes.tickets}/${Routes.view}/${Routes.ticket}/${data.id}`)
  }

  return (
    <div className={styles.wrapper} onClick={handleNavigateToViewTicket}>
      <div className={styles.topWrapper}>
        <div className={styles.topRow}>
          <span className={styles.code}>{data.code}</span>
          <div className={styles.statusMobile}>
            <Status title={data.status} status={data.status} />
          </div>
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{data.title}</span>
          {data.updateAt && (
            <div className={styles.container}>
              <span className={styles.uploadedTitle}>Update at:</span>
              <span className={styles.uploadedValue}>{data.updateAt}</span>
            </div>
          )}
        </div>
        <div className={styles.statusDesktop}>
          <Status title={data.status} status={data.status} />
        </div>
      </div>
    </div>
  )
}
