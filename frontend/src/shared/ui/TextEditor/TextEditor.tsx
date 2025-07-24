import './ThemeEditor.scss'

import JoditEditor, { Jodit } from 'jodit-react'
import { useMemo, useRef, useState } from 'react'

import { ChatGPTIcon } from '../../icons/ChatGPTIcon'
import { getChatGPTReadyPrompt } from '../../utils/api/Admin/ChatGPT/get-chat-gpt-ready-prompt'
import { sanitizeMessage } from '../../utils/TextEditor/sanitizeMessage'
import { Icon } from '../Icon/Icon'
import styles from './TextEditor.module.scss'

interface TextEditorProps {
  placeholder?: string
  defaultValue?: string
  noFullScreen?: boolean
  chatGPT?: boolean
  fieldName?: string
  setValue: (message: string) => void
}

export const TextEditor = ({
  defaultValue = '',
  placeholder = '',
  noFullScreen = false,
  chatGPT = false,
  fieldName,
  setValue,
}: TextEditorProps) => {
  const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(false)

  const editor = useRef<Jodit | null>(null)

  const handleOnChange = (value: string) => {
    const safeMessage = sanitizeMessage(value)

    setValue(safeMessage)
  }

  const handleSendPromptToChatGPT = async () => {
    setIsLoadingPrompt(true)

    let extraData = null

    const match = window.location.pathname.match(
      /\/admin\/business-plan\/(view|edit|make)\/(business-model|business-plan)(?:\/(\d+))?/,
    )

    if (match) {
      if (match[2] === 'business-model') {
        extraData = { id: match[3], type: 'businessModel' }
      } else if (match[2] === 'business-plan') {
        extraData = { id: match[3], type: 'businessPlan' }
      }
    }

    const response = await getChatGPTReadyPrompt(
      `?discussionId=${extraData?.id}&discussionModel=${extraData?.type}&message=${fieldName}`,
    )

    if (!response.status) return

    setIsLoadingPrompt(false)
    handleOnChange(response.data.data.message)
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
      style: {
        color: 'white',
      },
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
