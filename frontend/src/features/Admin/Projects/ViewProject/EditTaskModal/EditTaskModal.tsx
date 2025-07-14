import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'

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
import styles from './EditTaskModal.module.scss'

interface EditTaskModalProps {
  task: ProjectsTasksData
  modalOpen: boolean
  inputData: ProjectsTasksInputData
  editTask: (idTask: number) => void
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

  const [isMounted, setIsMounted] = useState(false)

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (modalOpen) {
      handleChangeInput('description', task.description)
      handleChangeInput('startDate', task.start)
      handleChangeInput('dueDate', task.dueDate)

      setIsMounted(true)
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
        {isMounted && (
          <>
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
                value={task.client.id}
                idList={inputData.client.map(client => client.id)}
                nameList={inputData.client.map(item =>
                  item.email !== ''
                    ? `${item.account} - ${item.email}`
                    : `${item.account}`,
                )}
                onChange={handleChangeInput}
              />
              <div className={styles.containerItems}>
                <span className={styles.containerItemsTitle}>
                  Description
                </span>
                <Textarea
                  autoFocus={false}
                  minHeight='140px'
                  maxHeight='232px'
                  color='gray.400'
                  backgroundColor='brand.800'
                  border='none'
                  _hover={{ border: 'none' }}
                  _focusVisible={{ border: 'none' }}
                  _focusWithin={{ border: 'none' }}
                  fontSize='16px'
                  fontWeight='400'
                  lineHeight='24px'
                  defaultValue={task.description}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    handleChangeInput('description', event.target.value)
                  }
                />
              </div>
            </div>
            <ButtonBlue
              title='Save'
              style={styles.buttonSave}
              onClick={
                form
                  ? () => {
                    editTask(task.id)
                    handleOpenCloseModal()
                  }
                  : undefined
              }
            />
          </>
        )}
      </div>
    </CustomModalWindow>
  )
}
