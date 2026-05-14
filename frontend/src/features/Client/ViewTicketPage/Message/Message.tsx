import { useState } from 'react'

import styles from './Message.module.scss'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { Tabs } from '../../../Admin/SupportPage/ViewTicketPage/Tabs/Tabs'

interface MessageProps {
  isAdmin: boolean
  isWriteMessage: boolean
  data?: any
  isNextWriteMessage?: boolean
  isLast?: boolean
  status?: string
  onSend?: (message: string, replyType?: string) => void
  sending?: boolean
  sendError?: string | null
}

export const Message = ({
  isAdmin,
  data,
  isWriteMessage,
  isNextWriteMessage,
  isLast,
  status,
  onSend,
  sending,
  sendError,
}: MessageProps) => {
  const [adminTabs, setAdminTabs] = useState<string>('Customer')
  const [editorValue, setEditorValue] = useState('')

  const wrapperClass = [
    styles.wrapper,
    isWriteMessage ? styles.writeMessage : '',
    !isAdmin && isLast && status === 'Closed' ? styles.lastClose : '',
    isLast && status === 'Open' ? styles.lastOpen : '',
    isNextWriteMessage ? styles.lineToReply : '',
  ].join(' ')

  const handleSend = () => {
    if (!editorValue.trim()) return
    onSend?.(editorValue, isAdmin ? adminTabs : 'Customer')
    setEditorValue('')
  }

  if ((isAdmin && isWriteMessage) || (!isAdmin && isWriteMessage && status !== 'Closed')) {
    return (
      <div className={wrapperClass}>
        <div className={styles.container}>
          <div className={styles.addReply}>Add Reply</div>
          <img alt='Avatar' className={styles.avatar} src='/profileWithoutAvatar.svg' />
        </div>
        <div className={styles.editor}>
          {isAdmin && (
            <div className={styles.tabs}>
              <Tabs isActiveTab={adminTabs} setIsActiveTab={setAdminTabs} />
            </div>
          )}
          <TextEditor setValue={setEditorValue} />
          {sendError && <span className={styles.sendError}>{sendError}</span>}
          <ButtonBlue
            title={sending ? 'Sending…' : 'Send'}
            style={styles.buttonSend}
            onClick={handleSend}
          />
        </div>
      </div>
    )
  }

  if (!data) return null

  const safeHTML = sanitizeMessage(data.message)

  return (
    <div className={wrapperClass}>
      <div className={styles.container}>
        <div className={styles.date}>{new Date(data.date.replace(' ', 'T')).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
        <img
          alt='Avatar'
          className={styles.avatar}
          src={
            data.account?.img
              ? `${data.account.img}?width=128&height=128`
              : '/profileWithoutAvatar.svg'
          }
        />
      </div>
      <div className={styles.message}>
        <span className={styles.messageName}>{data.account?.name}</span>
        <CustomDivider />
        <span dangerouslySetInnerHTML={{ __html: safeHTML }} className='dangerouslySetInnerHTML' />
        {data.files && data.files.length > 0 && (
          <div className={styles.fileList}>
            {data.files.map((f: any) => (
              <a
                key={f.id}
                href={f.link}
                target='_blank'
                rel='noreferrer'
                className={styles.fileItem}
                download={f.name}
              >
                <span className={styles.fileExt}>{f.ext}</span>
                <span className={styles.fileName}>{f.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
