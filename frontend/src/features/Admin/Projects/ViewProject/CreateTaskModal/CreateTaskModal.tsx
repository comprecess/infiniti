import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'

import {
  ProjectsTasksFormData,
  ProjectsTasksInputData,
} from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './CreateTaskModal.module.scss'

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

  return (
    <CustomModalWindow
      maxWidth='700px'
      isOpen={modalOpen}
      onClose={handleOpenCloseModal}
    >
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
          <CustomSelect
            title='Related Customer'
            titleOnChange='client'
            placeholder='Not Selected'
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
            <Textarea
              tabIndex={-1}
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
                createTask(form)
                handleOpenCloseModal()
              }
              : undefined
          }
        />
      </div>
    </CustomModalWindow>
  )
}
