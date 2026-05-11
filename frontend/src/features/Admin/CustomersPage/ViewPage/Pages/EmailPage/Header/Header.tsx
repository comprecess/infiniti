import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './Header.module.scss'
import { FileIcon } from '../../../../../../../shared/icons/FileIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'
import { ChooseTemplateModal } from '../../../../../../../shared/ui/ChooseTemplateModal/ChooseTemplateModal'

interface HeaderProps {
  inputTo: string
  updateInfo: (name: string, value: string | number) => void
  sendEmail: () => void
  subjectValue?: string
}

export const Header = ({ inputTo, updateInfo, sendEmail, subjectValue }: HeaderProps) => {
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [templateBody, setTemplateBody] = useState('')
  const { id } = useParams<{ id: string }>()
  const contactId = id ? parseInt(id) : undefined

  const updateTextEditor = (message: string) => {
    updateInfo('message', message)
  }

  const handleTemplateSelect = (subject: string, body: string) => {
    updateInfo('title', subject)
    updateInfo('message', body) // pre-fill values so Send works without re-typing
    setTemplateBody(body)
    setEditorKey(k => k + 1)
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
        value={subjectValue ?? ''}
        onInputChange={false}
        onChange={updateInfo}
      />
      <TextEditor key={editorKey} setValue={updateTextEditor} defaultValue={templateBody} />
      <div className={styles.wrapperTemplates}>
        <div
          className={styles.chooseTemplate}
          onClick={() => setTemplateModalOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.fileIcon}>
            <FileIcon />
          </div>
          <span className={styles.chooseTemplateText}>Choose from Template</span>
        </div>
        <ButtonBlue title='Send' style={styles.buttonBlue} onClick={sendEmail} />
      </div>

      <ChooseTemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        contactId={contactId}
        onSelect={handleTemplateSelect}
      />
    </div>
  )
}
