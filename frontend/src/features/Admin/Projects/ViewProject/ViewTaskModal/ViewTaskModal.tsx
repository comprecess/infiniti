import { useState } from 'react'

import {
  ProjectsTasksData,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './ViewTaskModal.module.scss'

interface ViewTaskModalProps {
  access?: RolesAccess
  modalOpen: boolean
  task: ProjectsTasksData
  handleIsEditTask: () => void
  handleOpenCloseModal: () => void
  deleteSelectedTask: (idTask: number) => void
}

export const ViewTaskModal = ({
  access,
  modalOpen,
  task,
  handleIsEditTask,
  handleOpenCloseModal,
  deleteSelectedTask,
}: ViewTaskModalProps) => {
  const [confirmModal, setConfirmModal] = useState<boolean>(false)

  const safeHTML = task.description
    ? sanitizeMessage(task.description)
    : null

  const handleSetConfirmModal = () => {
    setConfirmModal(prev => !prev)
  }

  const deleteTask = () => {
    deleteSelectedTask(task.id)
    handleSetConfirmModal()
    handleOpenCloseModal()
  }

  return (
    <>
      <CustomModalWindow
        maxWidth='700px'
        isOpen={modalOpen}
        onClose={handleOpenCloseModal}
      >
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h4 className={styles.title}>{task.title}</h4>
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.content}>
            <CustomDivider styles={styles.dividerTop} />
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
            {task.client && (
              <div className={styles.text}>
                <span className={styles.textTitle}>Related Customer:</span>
                <span className={styles.textValue}>
                  {task.client.account}
                </span>
              </div>
            )}
            {safeHTML && (
              <>
                <CustomDivider styles={styles.divider} />
                <div className={styles.description}>
                  <span className={styles.textTitle}>Description:</span>
                  <span
                    dangerouslySetInnerHTML={{ __html: safeHTML }}
                    className={styles.descriptionValue}
                  />
                </div>
              </>
            )}
            <CustomDivider styles={styles.divider} />
            <div className={styles.buttons}>
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
        </div>
      </CustomModalWindow>
      {confirmModal && (
        <ConfirmationModal
          isOpened={confirmModal}
          agree={deleteTask}
          handleOpenCloseModal={handleSetConfirmModal}
        />
      )}
    </>
  )
}
