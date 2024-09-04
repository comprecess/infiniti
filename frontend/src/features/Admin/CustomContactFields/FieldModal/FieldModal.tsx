import { FC } from 'react'

import { FieldProps } from '../../../../pages/Admin/SettingsPage/CustomContactFieldsPage/CustomContactFieldsPage'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CustomRadio } from '../../../../shared/ui/CustomRadio/CustomRadio'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './FieldModal.module.scss'

interface FieldModalProps {
  title: string
  modalField: boolean
  filedValues?: FieldProps
  handleOpenCloseModal: () => void
  functionModal: () => void
  handleInputChange: (
    name: string,
    value: string | string[] | number,
  ) => void
}

const types = ['textBox', 'password', 'dropDown', 'textArea']

export const FieldModal: FC<FieldModalProps> = ({
  title,
  modalField,
  filedValues,
  handleOpenCloseModal,
  functionModal,
  handleInputChange,
}) => {
  const convertDefaultValue = (item: number) => {
    if (item === 1) {
      return 'Yes'
    } else if (item === 0) {
      return 'No'
    }
  }

  const changeRadio = (item: string) => {
    if (item === 'Yes') {
      handleInputChange('showInvoice', 1)
    } else if (item === 'No') {
      handleInputChange('showInvoice', 0)
    }
  }

  const handleFieldOptionsChange = (
    name: string,
    value: string | number,
  ) => {
    const optionsArray: string[] = value
      .toString()
      .split(',')
      .map(option => option.trim())
      .filter(option => option !== '')

    handleInputChange(name, optionsArray)
  }

  const changeSelect = (_name: string, index: number) => {
    handleInputChange('type', types[index])
  }

  return (
    <CustomModalWindow
      maxWidth={'600px'}
      isOpen={modalField}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.container}>
          <CustomInput
            title='Field Name'
            type='text'
            id='name'
            name='name'
            value={filedValues?.name}
            onChange={handleInputChange}
          />
          <CustomSelect
            camelCase
            title='Field Type'
            size='lg'
            idList={types.map((_item, index) => index)}
            nameList={types}
            value={types.findIndex(value => value === filedValues?.type)}
            onChange={changeSelect}
          />
          <CustomInput
            title='Description'
            type='text'
            id='description'
            name='description'
            value={filedValues?.description}
            onChange={handleInputChange}
          />
          <CustomInput
            title='Validation'
            type='text'
            id='regexpr'
            name='regexpr'
            value={filedValues?.regexpr}
            onChange={handleInputChange}
          />
          <CustomInput
            title='Select Options'
            type='text'
            id='fieldOptions'
            name='fieldOptions'
            value={(filedValues?.fieldOptions || []).join(', ')}
            onChange={handleFieldOptionsChange}
          />
          <CustomRadio
            title='Show in View Invoice?'
            direction='column'
            radioList={['Yes', 'No']}
            defaultValue={convertDefaultValue(
              filedValues?.showInvoice || 0,
            )}
            onChange={changeRadio}
          />
        </div>
        <ButtonBlue title='Save' onClick={functionModal} />
      </div>
    </CustomModalWindow>
  )
}
