import './ThemeEditor.scss'

import JoditEditor, { Jodit } from 'jodit-react'
import { FC, useMemo, useRef } from 'react'

import { sanitizeMessage } from '../../utils/TextEditor/sanitizeMessage'
import styles from './TextEditor.module.scss'

interface TextEditorProps {
  placeholder?: string
  defaultValue?: string
  noFullScreen?: boolean
  getValue?: boolean
  setValue: (message: string) => void
}

export const TextEditor: FC<TextEditorProps> = ({
  defaultValue = '',
  placeholder = '',
  noFullScreen = false,
  getValue = false,
  setValue,
}) => {
  Jodit.defaultOptions.controls.getValue = {
    tooltip: 'Send to ChatGPT',

    icon: `<svg width="28" height="28" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.28774 4.72433C10.209 2.8819 10.6696 1.96069 11.2929 1.66508C11.8353 1.40782 12.4645 1.40782 13.007 1.66508C13.6303 1.96069 14.0909 2.88191 15.0121 4.72434L15.3714 5.4429C15.6558 6.01177 15.798 6.29621 16.0061 6.51399C16.1903 6.70676 16.4111 6.86077 16.6557 6.96694C16.932 7.08689 17.248 7.12201 17.8801 7.19225L18.2063 7.22849C20.4145 7.47385 21.5186 7.59653 22.0176 8.10561C22.4512 8.54802 22.6554 9.16639 22.5704 9.78001C22.4726 10.4861 21.6585 11.242 20.0304 12.7539L19.686 13.0736C19.1303 13.5897 18.8524 13.8477 18.6918 14.1604C18.5499 14.4368 18.4743 14.7424 18.471 15.0531C18.4673 15.4046 18.5945 15.7671 18.8489 16.4921V16.4921C19.6793 18.8587 20.0945 20.042 19.8229 20.7338C19.5873 21.3339 19.0769 21.7836 18.452 21.9418C17.7315 22.1241 16.6266 21.5717 14.4169 20.4668L13.581 20.0489C13.0563 19.7865 12.7939 19.6553 12.5187 19.6037C12.275 19.558 12.0249 19.558 11.7811 19.6037C11.5059 19.6553 11.2436 19.7865 10.7188 20.0489L9.88289 20.4668C7.67316 21.5717 6.56829 22.1241 5.84781 21.9418C5.22288 21.7836 4.71251 21.3339 4.47693 20.7338C4.20533 20.042 4.62053 18.8587 5.45092 16.4921V16.4921C5.70531 15.7671 5.83251 15.4046 5.82881 15.0531C5.82555 14.7424 5.74995 14.4368 5.60801 14.1604C5.44742 13.8477 5.16954 13.5897 4.61378 13.0736L4.26944 12.7539C2.64131 11.242 1.82725 10.4861 1.72943 9.78001C1.64443 9.16639 1.84857 8.54802 2.28219 8.10561C2.78117 7.59653 3.88528 7.47385 6.0935 7.22849L6.41967 7.19225C7.05179 7.12201 7.36786 7.08689 7.64413 6.96694C7.88869 6.86077 8.10956 6.70676 8.29373 6.51399C8.5018 6.29621 8.64401 6.01178 8.92845 5.44291L9.28774 4.72433Z" stroke="#09090B"/>
    </svg>`,
    exec: () => {},
  }

  const editor = useRef<Jodit | null>(null)

  const tools = noFullScreen
    ? getValue
      ? 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table,|,getValue'
      : 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table'
    : getValue
      ? 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table,|,fullsize,|,getValue'
      : 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table,|,fullsize'

  const config = useMemo(
    () => ({
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      spellcheck: true,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      minHeight: 180,
      placeholder,
      buttons: tools,
      buttonsXS: tools,
      buttonsMD: tools,
      buttonsSM: tools,
    }),
    [placeholder],
  )

  const handleOnChange = (value: string) => {
    const safeMessage = sanitizeMessage(value)

    setValue(safeMessage)
  }

  return (
    <div className={styles.wrapper}>
      <JoditEditor
        ref={editor}
        value={defaultValue}
        config={config}
        onBlur={handleOnChange}
      />
    </div>
  )
}
