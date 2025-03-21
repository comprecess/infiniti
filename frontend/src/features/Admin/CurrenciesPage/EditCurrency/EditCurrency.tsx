import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './EditCurrency.module.scss'

interface NewCurrencyProps {
  id: number
  inputValueName: string
  inputValueRate: string
  modalEditCurrency: boolean
  handleOpenCloseModal: () => void
  editCurrency: (id: number) => void
  handleInputChange: (name: string, value: string | number) => void
}

export const EditCurrency = ({
  id,
  inputValueName,
  inputValueRate,
  modalEditCurrency,
  handleOpenCloseModal,
  editCurrency,
  handleInputChange,
}: NewCurrencyProps) => {
  const handleEditCurrency = () => {
    editCurrency(id)
  }

  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalEditCurrency}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Edit Currency</h4>
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
            value={inputValueName}
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
            id='baseConversionRate'
            name='baseConversionRate'
            value={inputValueRate}
            onChange={handleInputChange}
          />
          <span className={styles.description}>
            Enter the value of 1 = How much RUB ?
          </span>
        </div>
        <ButtonBlue title='Save' onClick={handleEditCurrency} />
      </div>
    </CustomModalWindow>
  )
}
