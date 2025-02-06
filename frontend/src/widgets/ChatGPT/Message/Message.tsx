import { FC } from 'react'

import styles from './Message.module.scss'

interface MessageProps {
  text: string
  isMy: boolean
}

export const Message: FC<MessageProps> = ({ text, isMy }) => {
  return (
    <div className={`${isMy ? styles.myMessage : styles.otherMessage}`}>
      <div className={styles.bubble}>
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  )
}
