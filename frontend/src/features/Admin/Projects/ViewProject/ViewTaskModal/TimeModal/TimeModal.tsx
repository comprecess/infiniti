import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'

import styles from './TimeModal.module.scss'
import { ProjectsViewTaskTimeSpentData } from '../../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../../../../shared/ui/CustomToast/CustomToast'
import { patchUpdateTimeTask } from '../../../../../../shared/utils/api/Admin/Projects/patch-update-time-task'
import { postAddNewTimeTask } from '../../../../../../shared/utils/api/Admin/Projects/post-add-new-time-task'
import { useIdFromUrl } from '../../../../../../shared/utils/usefulMethods'
// import { postUpdateTimeTask } from '../../../../../../...'

interface TimeModalProps {
  data?: ProjectsViewTaskTimeSpentData
  title: string
  idTask: number
  isOpened: boolean
  refreshList?: () => void
  handleOpenCloseModal: () => void
}

export const TimeModal = ({
  data,
  title,
  idTask,
  isOpened,
  refreshList,
  handleOpenCloseModal,
}: TimeModalProps) => {
  const parseInitialForm = () => {
    if (!data) {
      return { date: '', hours: '', minutes: '', description: '' }
    }
    const [hh, mm] = data.time.split(':')

    return {
      date: data.date,
      hours: hh === '00' ? '' : hh,
      minutes: mm === '00' ? '' : mm,
      description: data.description,
    }
  }

  const [form, setForm] = useState(parseInitialForm)

  const idProject = useIdFromUrl('project')
  const showToast = useCustomToast()

  const updateForm = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const normalizeTime = () => {
    const hh = String(Number(form.hours || 0)).padStart(2, '0')
    const mm = String(Number(form.minutes || 0)).padStart(2, '0')

    return `${hh}:${mm}`
  }

  const submitTime = async () => {
    if (!idProject) return

    const payload = {
      date: form.date,
      time: normalizeTime(),
      description: form.description,
    }

    let response

    if (data) {
      response = await patchUpdateTimeTask(idProject, idTask, data.id, payload)
    } else {
      response = await postAddNewTimeTask(idProject, idTask, payload)
    }

    if (response?.status) {
      showToast({
        title: 'Successfully',
        description: data
          ? 'You have successfully updated Time.'
          : 'You have successfully added Time.',
        status: 'success',
      })
      handleOpenCloseModal()

      if (data && refreshList) {
        refreshList()
      }
    } else {
      showToast({
        title: 'Error',
        description: response?.message || 'Something went wrong',
        status: 'error',
      })
    }
  }

  return (
    <CustomModalWindow maxWidth='600px' isOpen={isOpened} onClose={handleOpenCloseModal}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.container}>
            <CustomDataPicker
              title='Date'
              titleOnChange='date'
              value={form.date}
              onChange={updateForm}
            />
            <div className={styles.inputs}>
              <CustomInput
                title='Hours'
                type='number'
                id='hours'
                name='hours'
                value={form.hours}
                onChange={updateForm}
              />
              <CustomInput
                title='Minutes'
                type='number'
                id='minutes'
                name='minutes'
                value={form.minutes}
                onChange={updateForm}
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
              value={form.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                updateForm('description', e.target.value)
              }
            />
          </div>
          <ButtonBlue title='Save' style={styles.buttonSave} onClick={submitTime} />
        </div>
      </div>
    </CustomModalWindow>
  )
}
