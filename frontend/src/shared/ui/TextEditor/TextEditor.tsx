import './ThemeEditor.scss'

import { FC } from 'react'
import ReactQuill from 'react-quill'

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
  return (
    <div className={styles.wrapper}>
      <ReactQuill
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={styles.editor}
        modules={modules}
        formats={formats}
        onChange={setValue}
      />
    </div>
  )
}
