import './ThemeEditor.scss'

import JoditEditor from 'jodit-react'
import { FC, useMemo, useRef } from 'react'

import { sanitizeMessage } from '../../utils/TextEditor/sanitizeMessage'

interface TextEditorProps {
  placeholder?: string
  defaultValue?: string
  noFullScreen?: boolean
  setValue: (message: string) => void
}

export const TextEditor: FC<TextEditorProps> = ({
  defaultValue = '',
  placeholder = '',
  noFullScreen = false,
  setValue,
}) => {
  const editor = useRef(null)

  const tools = noFullScreen
    ? 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table'
    : 'source,|,bold,italic,underline,strikethrough,eraser,|,ul,ol,indent,outdent,left,|,file,|,table,|,fullsize'

  const config = useMemo(
    () => ({
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      spellcheck: true,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      minHeight: 150,
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
    <JoditEditor
      ref={editor}
      value={defaultValue}
      config={config}
      onChange={handleOnChange}
    />
  )
}
