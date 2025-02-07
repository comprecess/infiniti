import { FC, useState } from 'react'

import styles from './Message.module.scss'

interface MessageProps {
  text: string
  isMy: boolean
}

export const Message: FC<MessageProps> = ({ text, isMy }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  return (
    <div className={`${isMy ? styles.myMessage : styles.otherMessage}`}>
      <div className={styles.bubble}>
        {!isMy && (
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? (
              <img src='/icons/checkBG.svg' alt='Copied' />
            ) : (
              <img src='/icons/copyBG.svg' alt='Copy' />
            )}
          </button>
        )}
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  )
}
