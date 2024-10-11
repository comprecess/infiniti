import './ThemeEditor.scss'

import { FC } from 'react'
import ReactQuill from 'react-quill'

import { sanitizeMessage } from '../../utils/TextEditor/sanitizeMessage'
import styles from './TextEditor.module.scss'

const modules = {
  toolbar: [
    [{ 'code-block': true }],
    ['bold', 'italic', 'strike', 'underline', 'clean'],
    [
      { list: 'bullet' },
      { list: 'ordered' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
    ['video'],
  ],
}

const formats = [
  'code-block',
  'bold',
  'italic',
  'strike',
  'underline',
  'clean',
  'list',
  'bullet',
  'ordered',
  'indent',
  'link',
  'video',
]

interface TextEditorProps {
  defaultValue?: string
  placeholder?: string
  setValue: (message: string) => void
}

export const TextEditor: FC<TextEditorProps> = ({
  defaultValue = '',
  placeholder = '',
  setValue,
}) => {
  const handleOnChange = (value: string) => {
    const safeMessage = sanitizeMessage(value)

    setValue(safeMessage)
  }

  return (
    <div className={styles.wrapper}>
      <ReactQuill
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={styles.editor}
        formats={formats}
        modules={modules}
        onChange={handleOnChange}
      />
    </div>
  )
}
