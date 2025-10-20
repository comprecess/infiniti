import { Textarea } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import styles from './KnowledgeBasePage.module.scss'
import { Message, QA } from '../../../features/Client/KnowledgeBasePage/Message/Message'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'

export const ClientKnowledgeBasePage = () => {
  const [value, setValue] = useState('')

  const [qaList] = useState<QA[]>([
    {
      id: 0,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
    {
      id: 1,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
    {
      id: 2,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
    {
      id: 3,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
    {
      id: 4,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
    {
      id: 5,
      question: 'How to reset my password?',
      answer:
        'To reset your password, you need to go to your Profile, scroll to the bottom, enter your password and click Submit.',
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Submitted:', value)
  }

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.messagesContainer}>
        <div className={styles.cards}>
          {qaList.map(item => (
            <Message key={item.id} data={item} />
          ))}
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>What is your question?</h2>
        <Textarea
          value={value}
          placeholder='Enter your request...'
          minHeight='140px'
          maxHeight='232px'
          color='gray.400'
          backgroundColor='brand.800'
          border='none'
          _hover={{ border: 'none' }}
          _focusVisible={{ border: 'none' }}
          fontSize='16px'
          fontWeight='400'
          lineHeight='24px'
          onChange={e => setValue(e.target.value)}
        />
        <ButtonBlue type='submit' title='Get an Answer' />
      </form>
    </div>
  )
}
