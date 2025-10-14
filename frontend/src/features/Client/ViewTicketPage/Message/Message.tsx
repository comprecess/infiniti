import styles from './Message.module.scss'
import { ClientTicketMessageData } from '../../../../app/constants/constants'
import { PaperClipIcon } from '../../../../shared/icons/PaperClipIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'

interface MessageProps {
  data?: ClientTicketMessageData
  isWriteMessage: boolean
  isNextWriteMessage?: boolean
  isLast?: boolean
  status?: string
}

export const Message = ({
  data,
  isWriteMessage,
  isNextWriteMessage,
  isLast,
  status,
}: MessageProps) => {
  const wrapperClass = `
  ${styles.wrapper}
  ${isWriteMessage ? styles.writeMessage : ''}
  ${isLast && status === 'Close' ? styles.lastClose : ''}
  ${isLast && status === 'Open' ? styles.lastOpen : ''}
  ${isNextWriteMessage ? styles.lineToReply : ''}
`

  if (isWriteMessage && status === 'Open') {
    return (
      <div className={wrapperClass}>
        <div className={styles.container}>
          <div className={styles.addReply}>Add Reply</div>
          <img alt='Avatar' className={styles.avatar} src={'/profileWithoutAvatar.svg'} />
        </div>
        <div className={styles.editor}>
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
      </div>
    </div>
  )
}
