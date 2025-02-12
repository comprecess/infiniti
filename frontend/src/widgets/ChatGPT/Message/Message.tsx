import { FC, useState } from 'react'

import styles from './Message.module.scss'

interface MessageProps {
  text: string
  type: 'out' | 'in'
  timestamp: string
  isLoadingMessage?: boolean
}

export const Message: FC<MessageProps> = ({
  text,
  type,
  timestamp,
  isLoadingMessage = false,
}) => {
  const [copied, setCopied] = useState(false)

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)

    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`${
        type === 'in' ? styles.myMessage : styles.otherMessage
      }`}
    >
      <div className={styles.bubble}>
        {type === 'out' && !isLoadingMessage && (
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? (
              <img src='/icons/checkBG.svg' alt='Copied' />
            ) : (
              <img src='/icons/copyBG.svg' alt='Copy' />
            )}
          </button>
        )}
        <span className={styles.text}>{text}</span>
        {!isLoadingMessage && (
          <span className={styles.timestamp}>{formatTime(timestamp)}</span>
        )}
      </div>
    </div>
  )
}
