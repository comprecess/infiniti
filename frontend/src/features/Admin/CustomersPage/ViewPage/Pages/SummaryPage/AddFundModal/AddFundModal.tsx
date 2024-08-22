import { FC, useState } from 'react'

import { CrossIcon } from '../../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './AddFundModal.module.scss'

interface AddFundModalProps {
  title: string
  name: string
  buttonTitle: string
  modalAddFund: boolean
  handleOpenCloseModal: () => void
  onSendValue: (name: string, value: string) => void
}

export const AddFundModal: FC<AddFundModalProps> = ({
  title,
  name,
  buttonTitle,
  modalAddFund,
  handleOpenCloseModal,
  onSendValue,
}) => {
  const [value, setValue] = useState<string>('')

  const onChange = (_name: string, value: string) => {
    setValue(value)
  }

  const sendValue = () => {
    onSendValue(name, value)
    handleOpenCloseModal()
  }

  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalAddFund}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <CustomInput
          type='number'
          id={name}
          name={name}
          onChange={onChange}
        />
        <ButtonBlue title={buttonTitle} onClick={sendValue} />
      </div>
    </CustomModalWindow>
  )
}
