import { FC } from 'react'

import { SalesInvoiceEmailTemplateData } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './EmailPanel.module.scss'

interface EmailPanelProps {
  info: SalesInvoiceEmailTemplateData | null
  modalEmailPanel: boolean
  handleOpenCloseModal: () => void
}

export const EmailPanel: FC<EmailPanelProps> = ({
  info,
  modalEmailPanel,
  handleOpenCloseModal,
}) => {
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
              id='to'
              name='to'
              value={info.variable.client_email}
              onChange={() => {}}
            />
            <CustomInput
              title='Cc'
              type='text'
              id='cc'
              name='cc'
              onChange={() => {}}
            />
            <CustomInput
              title='Bcc'
              type='text'
              id='bcc'
              name='bcc'
              onChange={() => {}}
            />
            <CustomInput
              title='Subject'
              type='text'
              id='subject'
              name='subject'
              value={info.subject}
              onChange={() => {}}
            />
            <div className={styles.texEditorWrapper}>
              <span className={styles.texEditorTitle}>Message Body</span>
              <TextEditor
                setValue={() => {}}
                defaultValue={info.message}
              />
            </div>
            {info.file && (
              <CustomCheckBox
                defaultChecked
                titleOnChange='file'
                title={info.file}
                onInputChange={() => {}}
              />
            )}
          </div>
          <ButtonBlue title='Send' style={styles.buttonSend} />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
