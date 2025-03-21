import { FileIcon } from '../../../../../../../shared/icons/FileIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Header.module.scss'

interface HeaderProps {
  inputTo: string
  updateInfo: (name: string, value: string | number) => void
  sendEmail: () => void
}

export const Header = ({
  inputTo,
  updateInfo,
  sendEmail,
}: HeaderProps) => {
  const updateTextEditor = (message: string) => {
    updateInfo('message', message)
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        readOnly
        title='To:'
        id='to'
        name='to'
        type='text'
        value={inputTo}
        onChange={() => {}}
      />
      <CustomInput
        title='Subject:'
        id='title'
        name='title'
        type='text'
        onChange={updateInfo}
      />
      <TextEditor setValue={updateTextEditor} />
      <div className={styles.wrapperTemplates}>
        <div className={styles.chooseTemplate}>
          <div className={styles.fileIcon}>
            <FileIcon />
          </div>
          <span className={styles.chooseTemplateText}>
            Choose from Template
          </span>
        </div>
        <ButtonBlue
          title='Send'
          style={styles.buttonBlue}
          onClick={sendEmail}
        />
      </div>
    </div>
  )
}
