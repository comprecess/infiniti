import { useEffect, useState } from 'react'

import styles from './AddPaymentModal.module.scss'
import { AdminInvoiceAddPaymentInfoData } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPayInfo } from '../../../../../shared/utils/api/Admin/Sales/Invoices/get-pay-info'

interface AddPaymentModalProps {
  idInvoice: number
  isOpen: boolean
  handleOpenClose: () => void
}

export const AddPaymentModal = ({ idInvoice, isOpen, handleOpenClose }: AddPaymentModalProps) => {
  const [info, setInfo] = useState<AdminInvoiceAddPaymentInfoData | null>(null)

  const getInfo = async () => {
    const response = await getPayInfo(idInvoice)

    if (!response.status) return

    console.log(response.data)
    setInfo(response.data)
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
            account (select)
            <CustomDataPicker title='Date' titleOnChange='date' onChange={() => {}} />
            description (textarea)
            <CustomInput
              title='Amount'
              type='number'
              id='amount'
              name='amount'
              onChange={() => {}}
            />
            category (select)
            <CustomInput
              readOnly
              title='Payer'
              type='text'
              id='payer'
              name='payer'
              value={info.client.account}
              onChange={() => {}}
            />
            method (select)
          </div>
          <ButtonBlue title='Save' style={styles.buttonSend} onClick={() => {}} />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
