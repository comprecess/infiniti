import { useState } from 'react'

import styles from './Message.module.scss'
import { PaperClipIcon } from '../../../../shared/icons/PaperClipIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomMiniButton } from '../../../../shared/ui/CustomMiniButton/CustomMiniButton'
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
}

export const Message = ({
  isAdmin,
  data,
  isWriteMessage,
  isNextWriteMessage,
  isLast,
  status,
}: MessageProps) => {
  const [adminTabs, setAdminTabs] = useState<string>('Customer')

  const wrapperClass = `
  ${styles.wrapper}
  ${isWriteMessage ? styles.writeMessage : ''}
  ${!isAdmin && isLast && status === 'Closed' ? styles.lastClose : ''}
  ${isLast && status === 'Open' ? styles.lastOpen : ''}
  ${isNextWriteMessage ? styles.lineToReply : ''}
`

  if ((isAdmin && isWriteMessage) || (!isAdmin && isWriteMessage && status === 'Open')) {
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
          <TextEditor setValue={() => {}} />
          <div className={styles.attach}>
            <PaperClipIcon style={styles.icon} />
            <span>Attach file</span>
          </div>
          <ButtonBlue title='Send' style={styles.buttonSend} />
        </div>
      </div>
    )
  }

  if (!data) return null

  const safeHTML = sanitizeMessage(data.message)

  return (
    <div className={wrapperClass}>
      <div className={styles.container}>
        <div className={styles.date}>{data.date}</div>
        <img
          alt='Avatar'
          className={styles.avatar}
          src={
            data.account.img
              ? `${data!.account.img}?width=128&height=128`
              : '/profileWithoutAvatar.svg'
          }
        />
      </div>
      <div className={styles.message}>
        <span className={styles.messageName}>{data.account.name}</span>
        <CustomDivider />
        <span dangerouslySetInnerHTML={{ __html: safeHTML }} className='dangerouslySetInnerHTML' />
        {isAdmin && (
          <div className={styles.miniButton}>
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
