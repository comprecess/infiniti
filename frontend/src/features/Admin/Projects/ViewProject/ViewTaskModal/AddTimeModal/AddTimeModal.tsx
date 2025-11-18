import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'

import styles from './AddTimeModal.module.scss'
import { CrossIcon } from '../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../../../../shared/ui/CustomToast/CustomToast'
import { postAddNewTimeTask } from '../../../../../../shared/utils/api/Admin/Projects/post-add-new-time-task'
import { useIdFromUrl } from '../../../../../../shared/utils/usefulMethods'

interface AddTimeModalProps {
  idTask: number
  isOpened: boolean
  handleOpenCloseModal: () => void
}

export const AddTimeModal = ({ idTask, isOpened, handleOpenCloseModal }: AddTimeModalProps) => {
  const [form, setForm] = useState<{
    date: string
    hours: string
    minutes: string
    description: string
  }>({
    date: '',
    hours: '',
    minutes: '',
    description: '',
  })

  const idProject = useIdFromUrl('project')
  const showToast = useCustomToast()

  const handleChangeInput = (field: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const addNewTime = async () => {
    if (!idProject) return

    const hhRaw = String(Number(form.hours))
    const hh = hhRaw.length < 2 ? hhRaw.padStart(2, '0') : hhRaw

    const mmRaw = String(Number(form.minutes))
    const mm = mmRaw.padStart(2, '0')

    const time = `${hh}:${mm}`

    const { status, message } = await postAddNewTimeTask(idProject, idTask, {
      date: form.date,
      time,
      description: form.description,
    })

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added Time.',
        status: 'success',
      })
      handleOpenCloseModal()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  return (
    <CustomModalWindow maxWidth='600px' isOpen={isOpened} onClose={handleOpenCloseModal}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Add Time</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.container}>
            <CustomDataPicker title='Date' titleOnChange='date' onChange={handleChangeInput} />
            <div className={styles.inputs}>
              <CustomInput
                title='Hours'
                type='number'
                id='hours'
                name='hours'
                value={form.hours}
                onChange={handleChangeInput}
              />
              <CustomInput
                title='Minutes'
                type='number'
                id='minutes'
                name='minutes'
                value={form.minutes}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Description</span>
            <Textarea
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
              value={form.description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleChangeInput('description', event.target.value)
              }
            />
          </div>
          <ButtonBlue title='Save' style={styles.buttonSave} onClick={addNewTime} />
        </div>
      </div>
    </CustomModalWindow>
  )
}
