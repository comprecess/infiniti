import { useState } from 'react'

import styles from './Message.module.scss'

interface MessageProps {
  text: string
  type: 'out' | 'in'
  timestamp: string
  isLoadingMessage?: boolean
}

export const Message = ({
  text,
  type,
  timestamp,
  isLoadingMessage = false,
}: MessageProps) => {
  const [copied, setCopied] = useState(false)

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const timezoneOffset = date.getTimezoneOffset() * 60000
    const localTime = new Date(date.getTime() - timezoneOffset)

    return localTime.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatText = (input: string): string => {
    return input
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
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
        <span
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
          className={styles.text}
        />
        {!isLoadingMessage && (
          <span className={styles.timestamp}>{formatTime(timestamp)}</span>
        )}
      </div>
    </div>
  )
}
