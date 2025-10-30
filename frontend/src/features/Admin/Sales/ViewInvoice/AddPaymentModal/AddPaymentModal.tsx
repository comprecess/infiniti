import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'

import styles from './AddPaymentModal.module.scss'
import { AdminInvoiceAddPaymentInfoData } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPayInfo } from '../../../../../shared/utils/api/Admin/Sales/Invoices/get-pay-info'
import { postAddPayInfo } from '../../../../../shared/utils/api/Admin/Sales/Invoices/post-add-pay-info'

interface AddPaymentModalProps {
  idInvoice: number
  isOpen: boolean
  handleOpenClose: () => void
}

interface FormData {
  description: string
  amount: number
  date: string
  account: number
  method: number
  category: number
}

export interface PartialFormData extends Partial<FormData> {
  [key: string]: string | number | boolean | null | undefined
}

export const AddPaymentModal = ({ idInvoice, isOpen, handleOpenClose }: AddPaymentModalProps) => {
  const [info, setInfo] = useState<AdminInvoiceAddPaymentInfoData | null>(null)

  const [formData, setFormData] = useState<PartialFormData>({})

  const showToast = useCustomToast()

  const getInfo = async () => {
    const response = await getPayInfo(idInvoice)

    if (!response.status) return

    setInfo(response.data)
  }

  const onChangeInput = (name: string, value: string | number | boolean | null | undefined) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[name]
      } else {
        updatedFormData[name] = value
      }

      return updatedFormData
    })
  }

  const onSubmit = async () => {
    const { status, message } = await postAddPayInfo(idInvoice, formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a Payment.',
        status: 'success',
      })
      handleOpenClose()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getInfo()
  }, [idInvoice])

  return (
    <CustomModalWindow maxWidth='600px' isOpen={isOpen} onClose={handleOpenClose}>
      {info ? (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h4 className={styles.title}>{info.invoice.description}</h4>
            <div className={styles.cross} onClick={handleOpenClose}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.content}>
            <CustomSelect
              title='Account'
              titleOnChange='account'
              value={info.accounts[0].id}
              idList={info.accounts.map(item => item.id)}
              nameList={info.accounts.map(item => item.name)}
              onChange={onChangeInput}
            />
            <CustomDataPicker title='Date' titleOnChange='date' onChange={onChangeInput} />
            <div className={styles.containerItems}>
              <span className={styles.containerItemsTitle}>Description</span>
              <Textarea
                minHeight='140px'
                maxHeight='232px'
                focusBorderColor='#1b1e29'
                borderColor='#1b1e29'
                color='gray.400'
                backgroundColor='brand.800'
                border='1px solid #1b1e29'
                _hover={{ borderColor: '#1b1e29' }}
                fontSize='16px'
                fontWeight='400'
                lineHeight='24px'
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  onChangeInput('description', event.target.value)
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <CustomInput
                title={`Amount (${info.invoice.currency.code})`}
                type='number'
                id='amount'
                name='amount'
                placeHolder={info.invoice.dueAmount.toString()}
                onChange={onChangeInput}
              />
              <span className={styles.textRemainder}>
                {`Remainder: ${info.invoice.dueAmountCurrency}`}
              </span>
            </div>
            <CustomSelect
              title='Category'
              titleOnChange='category'
              value={info.categories[0].id}
              idList={info.categories.map(item => item.id)}
              nameList={info.categories.map(item => item.name)}
              onChange={onChangeInput}
            />
            <CustomInput
              readOnly
              title='Payer'
              type='text'
              id='payer'
              name='payer'
              value={info.client.account}
              onChange={() => {}}
            />
            <CustomSelect
              title='Payment Method'
              titleOnChange='method'
              value={info.payMethods[0].id}
              idList={info.payMethods.map(item => item.id)}
              nameList={info.payMethods.map(item => item.name)}
              onChange={onChangeInput}
            />
          </div>
          <ButtonBlue title='Save' style={styles.buttonSend} onClick={onSubmit} />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
