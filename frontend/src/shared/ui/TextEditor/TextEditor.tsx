import './ThemeEditor.scss'

import { FC, useState } from 'react'
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
}

export const TextEditor: FC<TextEditorProps> = ({
  defaultValue,
  placeholder = '',
}) => {
  const [value, setValue] = useState<string>(defaultValue || '')

  return (
    <div className={styles.wrapper}>
      <ReactQuill
        placeholder={placeholder}
        value={value}
        className={styles.editor}
        modules={modules}
        formats={formats}
        onChange={setValue}
      />
    </div>
  )
}
