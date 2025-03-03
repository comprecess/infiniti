import './ThemeEditor.scss'

import JoditEditor, { Jodit } from 'jodit-react'
import { FC, useMemo, useRef, useState } from 'react'

import { ChatGPTIcon } from '../../icons/ChatGPTIcon'
import { postUserMessage } from '../../utils/api/Admin/ChatGPT/PostUserMessage'
import { sanitizeMessage } from '../../utils/TextEditor/sanitizeMessage'
import { Icon } from '../Icon/Icon'
import styles from './TextEditor.module.scss'

interface TextEditorProps {
  placeholder?: string
  defaultValue?: string
  noFullScreen?: boolean
  chatGPT?: boolean
  setValue: (message: string) => void
}

export const TextEditor: FC<TextEditorProps> = ({
  defaultValue = '',
  placeholder = '',
  noFullScreen = false,
  chatGPT = false,
  setValue,
}) => {
  const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(false)

  const editor = useRef<Jodit | null>(null)

  const handleOnChange = (value: string) => {
    const safeMessage = sanitizeMessage(value)

    setValue(safeMessage)
  }

  const handleSendPromptToChatGPT = async () => {
    setIsLoadingPrompt(true)

    let extraData = null

    const urlPatterns = [
      /\/admin\/business-plan\/view\/business-model\/(\d+)$/,
      /\/admin\/business-plan\/edit\/business-model\/(\d+)$/,
      /\/admin\/business-plan\/make-business-model\/?$/,
    ]

    let match = null

    for (const pattern of urlPatterns) {
      match = window.location.pathname.match(pattern)
      if (match) break
    }

    if (match) {
      extraData = { id: match[1], type: 'businessModel' }
    }

    const response = await postUserMessage(
      defaultValue,
      extraData?.id,
      extraData?.type,
    )

    setIsLoadingPrompt(false)
    handleOnChange(response.data.message)
  }

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
      minHeight: 180,
      placeholder,
      buttons: tools,
      buttonsXS: tools,
      buttonsMD: tools,
      buttonsSM: tools,
    }),
    [placeholder],
  )

  return (
    <div className={styles.wrapper}>
      <JoditEditor
        ref={editor}
        config={config}
        value={
          isLoadingPrompt ? 'ChatGPT has an answer for you' : defaultValue
        }
        onBlur={handleOnChange}
      />
      {chatGPT && (
        <button
          className={styles.chatGPTButton}
          onClick={handleSendPromptToChatGPT}
        >
          <Icon
            style={styles.chatGPTIconFirst}
            icon={<ChatGPTIcon style={styles.chatGPTIconSecond} />}
          />
        </button>
      )}
    </div>
  )
}
