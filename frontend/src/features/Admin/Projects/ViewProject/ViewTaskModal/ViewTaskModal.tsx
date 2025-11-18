import { useState } from 'react'

import { AddTimeModal } from './AddTimeModal/AddTimeModal'
import { LogsTable } from './LogsTable/LogsTable'
import { Tabs } from './Tabs/Tabs'
import { TimeSpentTable } from './TimeSpentTable/TimeSpentTable'
import styles from './ViewTaskModal.module.scss'
import { ProjectsTasksData, RolesAccess } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { Scrollable } from '../../../../../shared/ui/Scrollable/Scrollable'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'

interface ViewTaskModalProps {
  access?: RolesAccess
  modalOpen: boolean
  task: ProjectsTasksData
  filterStatus: string
  updateFilterStatus: (name: string) => void
  handleIsEditTask: () => void
  handleOpenCloseModal: () => void
  deleteSelectedTask: (idTask: number) => void
}

export const ViewTaskModal = ({
  access,
  modalOpen,
  task,
  filterStatus,
  updateFilterStatus,
  handleIsEditTask,
  handleOpenCloseModal,
  deleteSelectedTask,
}: ViewTaskModalProps) => {
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [addTimeModal, setAddTimeModal] = useState<boolean>(false)

  const safeHTML = task.description ? sanitizeMessage(task.description) : null

  const handleSetConfirmModal = () => {
    setConfirmModal(prev => !prev)
  }

  const handleSetAddTimeModal = () => {
    setAddTimeModal(prev => !prev)
  }

  const deleteTask = () => {
    deleteSelectedTask(task.id)
    handleSetConfirmModal()
    handleOpenCloseModal()
  }

  return (
    <>
      <CustomModalWindow maxWidth='700px' isOpen={modalOpen} onClose={handleOpenCloseModal}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h4 className={styles.title}>{task.title}</h4>
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          </div>
          <Tabs isActiveTab={filterStatus} setIsActiveTab={updateFilterStatus} />
          {filterStatus === 'Main' && (
            <div className={styles.content}>
              {task.start && (
                <div className={styles.text}>
                  <span className={styles.textTitle}>Start Date:</span>
                  <span className={styles.textValue}>{task.start}</span>
                </div>
              )}
              {task.dueDate && (
                <div className={styles.text}>
                  <span className={styles.textTitle}>Due Date:</span>
                  <span className={styles.textValue}>{task.end}</span>
                </div>
              )}
              {task.users && (
                <div className={styles.text}>
                  <span className={styles.textTitle}>Users:</span>
                  <span className={styles.textValue}>
                    {task.users.map(u => u.account).join(', ')}
                  </span>
                </div>
              )}
              {safeHTML && (
                <>
                  <CustomDivider styles={styles.divider} />
                  <div className={styles.description}>
                    <span className={styles.textTitle}>Description:</span>
                    <Scrollable>
                      <span
                        dangerouslySetInnerHTML={{ __html: safeHTML }}
                        className='dangerouslySetInnerHTML'
                      />
                    </Scrollable>
                  </div>
                </>
              )}
              <div className={styles.buttons}>
                {access?.create === 1 && (
                  <CustomMiniButton
                    style='blue'
                    icon='/icons/clock.svg'
                    alt='Add Time'
                    tooltipTitle='Add Time'
                    onClick={handleSetAddTimeModal}
                  />
                )}
                {access?.edit === 1 && (
                  <CustomMiniButton
                    style='amber'
                    icon='/icons/edit.svg'
                    alt='Edit'
                    tooltipTitle='Edit'
                    onClick={handleIsEditTask}
                  />
                )}
                {access?.delete === 1 && (
                  <CustomMiniButton
                    style='cherry'
                    icon='/icons/trash.svg'
                    alt='Delete'
                    tooltipTitle='Delete'
                    onClick={handleSetConfirmModal}
                  />
                )}
              </div>
            </div>
          )}
          {filterStatus === 'Time Spent' && <TimeSpentTable idTask={task.id} />}
          {filterStatus === 'Logs' && <LogsTable />}
        </div>
      </CustomModalWindow>
      {confirmModal && (
        <ConfirmationModal
          isOpened={confirmModal}
          agree={deleteTask}
          handleOpenCloseModal={handleSetConfirmModal}
        />
      )}
      {addTimeModal && (
        <AddTimeModal
          idTask={task.id}
          isOpened={addTimeModal}
          handleOpenCloseModal={handleSetAddTimeModal}
        />
      )}
    </>
  )
}
