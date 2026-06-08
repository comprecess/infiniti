import { Fragment, useEffect, useState } from 'react'

import { Item } from './Item/Item'
import styles from './TimeSpentTable.module.scss'
import { ProjectsViewTaskTimeSpentData } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { useCustomToast } from '../../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteProjectTimeSpentTask } from '../../../../../../shared/utils/api/Admin/Projects/delete-project-time-spent-task'
import { getViewTaskTimeSpent } from '../../../../../../shared/utils/api/Admin/Projects/get-view-task-time-spent'
import { useIdFromUrl } from '../../../../../../shared/utils/usefulMethods'
import { Title } from '../../../../../Main/RecentCard/Title/Title'

interface TimeSpentTableProps {
  idTask: number
  isClientView: boolean
}

export const TimeSpentTable = ({ idTask, isClientView }: TimeSpentTableProps) => {
  const [timeSpentData, setTimeSpentData] = useState<ProjectsViewTaskTimeSpentData[] | null>(null)

  const idProject = useIdFromUrl('project')

  const showToast = useCustomToast()

  const getTimeSpentTask = async () => {
    if (!idProject) return

    const response = await getViewTaskTimeSpent(
      isClientView
        ? `${import.meta.env.VITE_CLIENT_PROJECTS}`
        : `${import.meta.env.VITE_RESIDENT_PROJECTS_API}`,
      idProject,
      idTask,
    )

    if (!response.status) return

    setTimeSpentData(response.data.data)
  }

  const deleteTimeSpent = async (idTime: number) => {
    if (!idProject) return

    const { status, message } = await deleteProjectTimeSpentTask(
      isClientView
        ? `${import.meta.env.VITE_CLIENT_PROJECTS}`
        : `${import.meta.env.VITE_RESIDENT_PROJECTS_API}`,
      idProject,
      idTask,
      idTime,
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Entry',
        status: 'success',
      })
      getTimeSpentTask()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
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

  // Calculate total tracked time
  const totalMinutes = timeSpentData.reduce((acc, entry) => {
    if (entry.time) {
      const parts = entry.time.split(':')
      const hours = parseInt(parts[0] || '0', 10)
      const mins = parseInt(parts[1] || '0', 10)
      return acc + hours * 60 + mins
    }
    return acc
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMins = totalMinutes % 60
  const totalTimeStr = totalHours > 0
    ? `${totalHours}h ${remainingMins > 0 ? remainingMins + 'm' : ''}`
    : `${remainingMins}m`

  return (
    <div className={styles.wrapper}>
      <div className={styles.totalTime}>
        <span className={styles.totalTimeLabel}>Total time:</span>
        <span className={styles.totalTimeValue}>{totalTimeStr}</span>
      </div>
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
              <Item
                isClientView={isClientView}
                data={data}
                idTask={idTask}
                refreshList={getTimeSpentTask}
                deleteTimeSpent={deleteTimeSpent}
              />
              {index !== timeSpentData.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
