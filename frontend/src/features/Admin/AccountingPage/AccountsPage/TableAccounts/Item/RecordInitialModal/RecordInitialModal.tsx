import { useState } from 'react'

import { AccountingAccountsInputData } from '../../../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './RecordInitialModal.module.scss'

interface RecordInitialModalProps {
  inputData: AccountingAccountsInputData
  isOpened: boolean
  handleOpenCloseModal: () => void
  agree: (form: {
    balance: { amount: string; currency: number }[]
  }) => void
}

export const RecordInitialModal = ({
  inputData,
  isOpened,
  handleOpenCloseModal,
  agree,
}: RecordInitialModalProps) => {
  const [form, setForm] = useState<{
    balance: { amount: string; currency: number }[]
  }>({
    balance: [],
  })

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    if (field.startsWith('currency-')) {
      const currencyId = Number(field.split('-')[1])

      setForm(prevFormData => {
        const prevBalance = prevFormData.balance ?? []

        const updatedBalance: { amount: string; currency: number }[] = [
          ...prevBalance,
        ]

        const existingIndex = updatedBalance.findIndex(
          b => b.currency === currencyId,
        )

        if (existingIndex !== -1) {
          updatedBalance[existingIndex] = {
            ...updatedBalance[existingIndex],
            amount: value?.toString() ?? '',
          }
        } else {
          updatedBalance.push({
            currency: currencyId,
            amount: value?.toString() ?? '',
          })
        }

        return {
          ...prevFormData,
          balance: updatedBalance,
        }
      })
    } else {
      setForm(prevFormData => ({
        ...prevFormData,
        [field]: value,
      }))
    }
  }

  const handleSubmit = () => {
    agree(form)
  }

  return (
    <CustomModalWindow
      maxWidth='600px'
      isOpen={isOpened}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Record Initial Balance</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.inputs}>
          {inputData.currency.map(item => (
            <CustomInput
              key={item.id}
              title={`Initial Balance [ ${item.code} ]`}
              type='number'
              id={`currency-${item.id}`}
              name={`currency-${item.id}`}
              onChange={handleChangeInput}
            />
          ))}
          <ButtonBlue
            title='Submit'
            style={styles.buttonSubmit}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </CustomModalWindow>
  )
}
