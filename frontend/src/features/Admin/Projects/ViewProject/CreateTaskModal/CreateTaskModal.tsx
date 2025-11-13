import { useState } from 'react'

import styles from './CreateTaskModal.module.scss'
import {
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

interface CreateTaskModalProps {
  modalOpen: boolean
  inputData: ProjectsTasksInputData
  createTask: (form: Partial<ProjectsTasksFormData>) => void
  handleOpenCloseModal: () => void
}

export const CreateTaskModal = ({
  modalOpen,
  inputData,
  createTask,
  handleOpenCloseModal,
}: CreateTaskModalProps) => {
  const [form, setForm] = useState<Partial<ProjectsTasksFormData>>()

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | { userType: string; id: number }[] | undefined | null,
  ) => {
    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  return (
    <CustomModalWindow maxWidth='700px' isOpen={modalOpen} onClose={handleOpenCloseModal}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>New Task</h4>
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
            onChange={handleChangeInput}
          />
          <div className={styles.dates}>
            <CustomDataPicker
              title='Start Date'
              titleOnChange='startDate'
              onChange={handleChangeInput}
            />
            <CustomDataPicker
              title='Due Date'
              titleOnChange='dueDate'
              onChange={handleChangeInput}
            />
          </div>
          <TagSelector
            title='Users'
            list={inputData.users.map(item => item.account)}
            selectedTags={[]}
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
              setValue={message => handleChangeInput('description', message)}
            />
          </div>
        </div>
        <ButtonBlue
          title='Save'
          style={styles.buttonSave}
          onClick={
            form
              ? () => {
                createTask(form)
              }
              : undefined
          }
        />
      </div>
    </CustomModalWindow>
  )
}
