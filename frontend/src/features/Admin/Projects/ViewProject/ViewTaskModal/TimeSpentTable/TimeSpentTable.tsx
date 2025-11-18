import { Fragment, useCallback, useEffect, useState } from 'react'

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

  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1])
  const [page] = useState<number>(1)
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)

  const idProject = useIdFromUrl('project')

  const getTimeSpentTask = async () => {
    if (!idProject) return

    const urlOptions = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`

    const response = await getViewTaskTimeSpent(idProject, idTask, urlOptions)

    if (!response.status) return

    setTimeSpentData(response.data.data)
  }

  const changeSort = useCallback((sortNameItem: string, sortTypeItem: number) => {
    setSortName(sortNameItem)
    setSortType(sortTypeItem)
  }, [])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 1)),
      )
      changeSort(sortNameItem, sortTypeItem)
    },
    [changeSort],
  )

  const clearSort = () => {
    setSortNumbers(new Array(4).fill(1))
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
        <Title
          sorted
          title='#'
          style={styles.avatarColumn}
          sortType={sortNumbers[0]}
          sortName='code'
          sortIndex={0}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Account'
          style={styles.accountColumn}
          sortType={sortNumbers[1]}
          sortName='account'
          sortIndex={1}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Amount'
          style={styles.descriptionColumn}
          sortType={sortNumbers[2]}
          sortName='amount'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Invoice Date'
          style={styles.timeColumn}
          sortType={sortNumbers[3]}
          sortName='invoiceDate'
          sortIndex={3}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {timeSpentData.map((item, index) => {
          return (
            <Fragment key={item.id}>
              Item
              {index !== timeSpentData.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
