import { useEffect, useState } from 'react'

import styles from './EmailPanel.module.scss'
import { SalesOfferEmailTemplateData } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import { sendEmailOffer } from '../../../../../shared/utils/api/Admin/Sales/Offers/SendEmailOffer'

interface EmailPanelProps {
  idOffer: number | null
  template: string
  info: SalesOfferEmailTemplateData
  modalEmailPanel: boolean
  handleOpenCloseModal: () => void
}

interface FormData {
  subject: string
  message: string
  toEmail: string
  bccEmail: string
  ccEmail: string
  attachFile: number
}

export interface PartialFormData extends Partial<FormData> {
  [key: string]: string | number | boolean | null | undefined
}

export const EmailPanel = ({
  idOffer,
  template,
  info,
  modalEmailPanel,
  handleOpenCloseModal,
}: EmailPanelProps) => {
  const [formData, setFormData] = useState<PartialFormData>({})

  const showToast = useCustomToast()

  const updateFormData = () => {
    setFormData({
      subject: info.subject,
      toEmail: info.variable.client_email,
      message: info.message,
      bccEmail: '',
      attachFile: 1,
    })
  }

  const onChangeInput = (
    name: string,
    value: string | number | boolean | null | undefined,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[name]
      } else if (name === 'attachFile') {
        if (value === true) {
          updatedFormData[name] = 1
        } else {
          updatedFormData[name] = 0
        }
      } else {
        updatedFormData[name] = value
      }

      return updatedFormData
    })
  }

  const handleBccClick = () => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      updatedFormData.bccEmail = info.adminEmail

      return updatedFormData
    })
  }

  const sendEmail = async () => {
    if (idOffer === null) return

    const sendResponse = await sendEmailOffer(idOffer, template, formData)

    if (sendResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully sent your email',
        status: 'success',
      })
      handleOpenCloseModal()
    } else {
      showToast({
        title: 'Error',
        description: sendResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    updateFormData()
  }, [info])

  return (
    <CustomModalWindow
      maxWidth={'600px'}
      isOpen={modalEmailPanel}
      onClose={handleOpenCloseModal}
    >
      {info ? (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h4 className={styles.title}>{info.variable.code}</h4>
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.content}>
            <CustomInput
              title='To'
              type='text'
              id='toEmail'
              name='toEmail'
              value={info.variable.client_email}
              onChange={onChangeInput}
            />
            <CustomInput
              title='Cc'
              type='text'
              id='ccEmail'
              name='ccEmail'
              onChange={onChangeInput}
            />
            <div className={styles.inputDescription}>
              {formData.bccEmail && (
                <CustomInput
                  title='Bcc'
                  type='text'
                  id='bccEmail'
                  name='bccEmail'
                  value={formData.bccEmail}
                  onChange={onChangeInput}
                />
              )}
              {!formData.bccEmail && (
                <CustomInput
                  title='Bcc'
                  type='text'
                  id='bccEmail'
                  name='bccEmail'
                  onChange={onChangeInput}
                />
              )}
              <span
                className={styles.description}
                onClick={handleBccClick}
              >
                Send Bcc to Admin? Click Here.
              </span>
            </div>
            <CustomInput
              title='Subject'
              type='text'
              id='subject'
              name='subject'
              value={info.subject}
              onChange={onChangeInput}
            />
            <div className={styles.texEditorWrapper}>
              <span className={styles.texEditorTitle}>Message Body</span>
              <TextEditor
                setValue={message => onChangeInput('message', message)}
                defaultValue={info.message}
              />
            </div>
            {info.file && (
              <CustomCheckBox
                defaultChecked
                titleOnChange='attachFile'
                title={info.file}
                onInputChange={onChangeInput}
              />
            )}
          </div>
          <ButtonBlue
            title='Send'
            style={styles.buttonSend}
            onClick={sendEmail}
          />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
