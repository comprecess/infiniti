import { useState } from 'react'

import styles from './Message.module.scss'

export interface QA {
  id: number
  question: string
  answer: string
}

interface MessageProps {
  data: QA
}

export const Message = ({ data }: MessageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handlePrevChange = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <div className={styles.wrapper} onClick={handlePrevChange}>
      <p className={styles.question}>{data.question}</p>
      {isOpen && <p className={styles.answer}>{data.answer}</p>}
    </div>
  )
}
