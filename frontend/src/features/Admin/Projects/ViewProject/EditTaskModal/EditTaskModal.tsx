import { useState } from 'react'

import styles from './EditTaskModal.module.scss'
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
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'

interface EditTaskModalProps {
  task: ProjectsTasksData
  modalOpen: boolean
  inputData: ProjectsTasksInputData
  editTask: (idTask: number, form: Partial<ProjectsTasksFormData>) => void
  handleOpenCloseModal: () => void
}

export const EditTaskModal = ({
  task,
  modalOpen,
  inputData,
  editTask,
  handleOpenCloseModal,
}: EditTaskModalProps) => {
  const [form, setForm] = useState<Partial<ProjectsTasksFormData>>()

  const handleChangeInput = (
    field: string,
    value: string | number | { userType: string; id: number }[] | string[] | undefined | null,
  ) => {
    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  const handleEditTask = () => {
    if (!form) return

    editTask(task.id, form)

    handleOpenCloseModal()
  }

  return (
    <CustomModalWindow maxWidth='700px' isOpen={modalOpen} onClose={handleOpenCloseModal}>
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
            onInputChange={false}
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
          <TagSelector
            title='Users'
            list={inputData.users.map(item => item.account)}
            selectedTags={inputData.users
              .filter(item => task?.users?.some(u => u.id === item.id))
              .map(item => item.account)}
            onTagsChange={tags => {
              const formattedUsers = tags.map(tag => {
                const user = inputData.users.find(u => u.account === tag)

                return {
                  userType: user?.userType ?? 'Client',
                  id: user?.id ?? 0,
                }
              })
              handleChangeInput('users', formattedUsers)
            }}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Description</span>
            <TextEditor
              fieldName='description'
              defaultValue={task.description}
              setValue={message => handleChangeInput('description', message)}
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
