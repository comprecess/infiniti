import { useEffect, useState } from 'react'

import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
} from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './EditTaskModal.module.scss'

interface EditTaskModalProps {
  task: ProjectsTasksData
  modalOpen: boolean
  inputData: ProjectsTasksInputData
  editTask: (idTask: number, form: Partial<ProjectsTasksFormData>) => void
  handleOpenCloseViewModal: () => void
  handleOpenCloseModal: () => void
}

export const EditTaskModal = ({
  task,
  modalOpen,
  inputData,
  editTask,
  handleOpenCloseModal,
  handleOpenCloseViewModal,
}: EditTaskModalProps) => {
  const [form, setForm] = useState<Partial<ProjectsTasksFormData>>()

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    if (field === 'client' && typeof value === 'number' && value === 0) {
      value = null
    }

    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  const handleEditTask = () => {
    if (!form) return

    editTask(task.id, form)
    handleOpenCloseModal()
    handleOpenCloseViewModal()
  }

  useEffect(() => {
    if (modalOpen) {
      handleChangeInput('description', task.description)
      handleChangeInput('startDate', task.start)
      handleChangeInput('dueDate', task.dueDate)
    }
  }, [modalOpen])

  return (
    <CustomModalWindow
      maxWidth='700px'
      isOpen={modalOpen}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{`Edit Task - ${task.title}`}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.form}>
          <CustomInput
            title='Subject'
            type='text'
            id='title'
            name='title'
            value={task.title}
            onChange={handleChangeInput}
          />
          <div className={styles.dates}>
            <CustomDataPicker
              title='Start Date'
              titleOnChange='startDate'
              value={task.start}
              onChange={handleChangeInput}
            />
            <CustomDataPicker
              title='Due Date'
              titleOnChange='dueDate'
              value={task.end}
              onChange={handleChangeInput}
            />
          </div>
          <CustomSelect
            title='Related Customer'
            titleOnChange='client'
            placeholder='Not Selected'
            value={task.client ? task.client.id : undefined}
            idList={inputData.client.map(client => client.id)}
            nameList={inputData.client.map(item =>
              item.email !== ''
                ? `${item.account} - ${item.email}`
                : `${item.account}`,
            )}
            onChange={handleChangeInput}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Description</span>
            <TextEditor
              fieldName='description'
              defaultValue={task.description}
              setValue={message =>
                handleChangeInput('description', message)
              }
            />
          </div>
        </div>
        <ButtonBlue
          title='Save'
          style={styles.buttonSave}
          onClick={form ? handleEditTask : undefined}
        />
      </div>
    </CustomModalWindow>
  )
}
