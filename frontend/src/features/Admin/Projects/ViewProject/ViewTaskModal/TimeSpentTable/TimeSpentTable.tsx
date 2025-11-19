import { Fragment, useEffect, useState } from 'react'

import { Item } from './Item/Item'
import styles from './TimeSpentTable.module.scss'
import { ProjectsViewTaskTimeSpentData } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getViewTaskTimeSpent } from '../../../../../../shared/utils/api/Admin/Projects/get-view-task-time-spent'
import { useIdFromUrl } from '../../../../../../shared/utils/usefulMethods'
import { Title } from '../../../../../Main/RecentCard/Title/Title'

interface TimeSpentTableProps {
  idTask: number
}

export const TimeSpentTable = ({ idTask }: TimeSpentTableProps) => {
  const [timeSpentData, setTimeSpentData] = useState<ProjectsViewTaskTimeSpentData[] | null>(null)

  const idProject = useIdFromUrl('project')

  const getTimeSpentTask = async () => {
    if (!idProject) return

    const response = await getViewTaskTimeSpent(idProject, idTask)

    if (!response.status) return

    setTimeSpentData(response.data.data)
  }

  useEffect(() => {
    getTimeSpentTask()
  }, [idProject])

  if (!timeSpentData) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    )
  }

  if (timeSpentData.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Avatar' style={styles.avatarColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Date / Time' style={styles.timeColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {timeSpentData.map((data, index) => {
          return (
            <Fragment key={data.id}>
              <Item data={data} />
              {index !== timeSpentData.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
