import { FC } from 'react'

import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './NewCurrency.module.scss'

interface NewCurrencyProps {
  modalNewCurrency: boolean
  handleOpenCloseModal: () => void
  createNewCurrency: () => void
  handleInputChange: (name: string, value: string | number) => void
}

export const NewCurrency: FC<NewCurrencyProps> = ({
  modalNewCurrency,
  handleOpenCloseModal,
  createNewCurrency,
  handleInputChange,
}) => {
  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalNewCurrency}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.input}>
        <div className={styles.header}>
          <h4 className={styles.title}>New Currency</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.inputDescription}>
          <CustomInput
            title='Currency Code'
            type='text'
            id='currencyCode'
            name='currencyCode'
            onChange={handleInputChange}
          />
          <span className={styles.description}>
            Currency ISO Code, eg. USD, GBP, INR etc...
          </span>
        </div>
        <div className={styles.inputDescription}>
          <CustomInput
            title='Base Conversion Rate'
            type='number'
            id='rate'
            name='rate'
            onChange={handleInputChange}
          />
          <span className={styles.description}>
            Enter the value of 1 = How much RUB ?
          </span>
        </div>
        <ButtonBlue title='Save' onClick={createNewCurrency} />
      </div>
    </CustomModalWindow>
  )
}
