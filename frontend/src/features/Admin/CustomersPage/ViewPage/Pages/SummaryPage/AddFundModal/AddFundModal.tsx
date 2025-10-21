import { useEffect, useState } from 'react'

import styles from './AddFundModal.module.scss'
import { CrossIcon } from '../../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getMinMaxAddFund } from '../../../../../../../shared/utils/api/Client/Dashboard/get-min-max-add-fund'

interface AddFundModalProps {
  title: string
  name: string
  buttonTitle: string
  modalAddFund: boolean
  isAdmin: boolean
  handleOpenCloseModal: () => void
  onSendValue: (name: string, value: string) => void
}

export const AddFundModal = ({
  title,
  name,
  buttonTitle,
  modalAddFund,
  isAdmin,
  handleOpenCloseModal,
  onSendValue,
}: AddFundModalProps) => {
  const [addFundData, setAddFundData] = useState<{
    currency: { info: { symbol: string } }
    max: number
    min: number
  } | null>(null)

  const [value, setValue] = useState<number | ''>('')
  const [error, setError] = useState<string>('')

  const onChange = (_name: string, value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value

    if (isNaN(num)) {
      setValue('')
      setError('')

      return
    }

    setValue(num)

    if (!isAdmin && addFundData) {
      if (num < addFundData.min) {
        setError(`Минимальная сумма — ${addFundData.min}`)
      } else if (num > addFundData.max) {
        setError(`Максимальная сумма — ${addFundData.max}`)
      } else {
        setError('')
      }
    } else {
      setError('')
    }
  }

  const sendValue = () => {
    if (value === '' || value === null || error) return

    const stringValue = value.toString()

    onSendValue(name, stringValue)
    handleOpenCloseModal()
  }

  const getAddFundMinMax = async () => {
    const response = await getMinMaxAddFund()

    if (!response?.status) return

    setAddFundData(response.data)
  }

  useEffect(() => {
    if (!isAdmin) {
      getAddFundMinMax()
    }
  }, [isAdmin])

  const canShowButton = isAdmin || (!isAdmin && !!addFundData)

  return (
    <CustomModalWindow maxWidth='400px' isOpen={modalAddFund} onClose={handleOpenCloseModal}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        {isAdmin && (
          <CustomInput
            type='number'
            id={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
        {!isAdmin && (
          <>
            {!addFundData && (
              <div className={styles.loading}>
                <LoadingSpinner />
              </div>
            )}
            {addFundData && (
              <div className={styles.inputWrapper}>
                <div className={styles.inputWithCurrency}>
                  <CustomInput
                    type='number'
                    id={name}
                    name={name}
                    min={addFundData.min}
                    max={addFundData.max}
                    value={value}
                    placeHolder={`min: ${addFundData.min}, max: ${addFundData.max}`}
                    onChange={onChange}
                  />
                  <span className={styles.currencySymbol}>{addFundData.currency.info.symbol}</span>
                </div>
                {error && <div className={styles.error}>{error}</div>}
              </div>
            )}
          </>
        )}
        {canShowButton && <ButtonBlue title={buttonTitle} onClick={sendValue} />}
      </div>
    </CustomModalWindow>
  )
}
