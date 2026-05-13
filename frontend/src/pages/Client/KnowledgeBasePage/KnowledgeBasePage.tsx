import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import styles from './KnowledgeBasePage.module.scss'
import { MessageChatGPT } from '../../../app/constants/constants'
import { Message } from '../../../widgets/ChatGPT/Message/Message'
import { SuggestedQuestion } from '../../../features/Client/KnowledgeBasePage/SuggestedQuestion/SuggestedQuestion'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'

const SUGGESTED_QUESTIONS = [
  'How does the Infiniti platform work?',
  'How do I create a business plan?',
  'How do I add and manage leads?',
  'How do I create an invoice?',
  'How do projects and tasks work?',
  'What is the Knowledge Base section for?',
]

export const ClientKnowledgeBasePage = () => {
  const { register, handleSubmit, reset, setValue } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  })

  const [messages, setMessages] = useState<MessageChatGPT[] | null>(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [chatStarted, setChatStarted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const fetchHistory = useCallback(async () => {
    const history = await getKBHistory()
    if (history.status) {
      const raw: any[] = history.data?.data ?? []
      const mapped: MessageChatGPT[] = raw.map((m: any) => ({
        id:      m.id,
        message: m.message,
        type:    m.type,
        create:  m.create,
      }))
      setMessages(mapped)
      if (mapped.length > 0) setChatStarted(true)
    } else {
      setMessages([])
    }
  }, [])

  const send = async (message: string) => {
    if (!message.trim() || isLoading) return

    setChatStarted(true)
    setIsLoading(true)
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const userMessage: MessageChatGPT = {
      id:     Date.now(),
      message,
      type:   'in',
      create: currentDate,
    }

    reset({ message: '' })
    setMessages(prev => (prev ? [...prev, userMessage] : [userMessage]))

    const loadingMessage: MessageChatGPT = {
      id:               Date.now() + 1,
      message:          'Infiniti AI is thinking',
      type:             'out',
      create:           currentDate,
      isLoadingMessage: true,
    }

    setMessages(prev => (prev ? [...prev, loadingMessage] : [loadingMessage]))

    let dots = ''
    const interval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : ''
      setMessages(
        prev =>
          prev?.map(msg =>
            msg.id === loadingMessage.id
              ? { ...msg, message: `Infiniti AI is thinking${dots}` }
              : msg,
          ) ?? [],
      )
    }, 500)

    const response = await postKBMessage(message)
    clearInterval(interval)

    if (response.status) {
      const aiMsg = response.data?.data
      setMessages(prev =>
        prev
          ? prev.filter(m => m.id !== loadingMessage.id).concat({
              id:      aiMsg?.id ?? Date.now() + 2,
              message: aiMsg?.message ?? '',
              type:    'out',
              create:  aiMsg?.create ?? currentDate,
            })
          : [],
      )
    } else {
      setMessages(prev => prev?.filter(m => m.id !== loadingMessage.id) ?? [])
    }

    setIsLoading(false)
  }

  const onSubmit = ({ message }: { message: string }) => send(message)

  const onSuggestedClick = (question: string) => {
    setValue('message', question)
    send(question)
  }

  useEffect(() => { fetchHistory() }, [fetchHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.messagesContainer}>

        {/* Suggested questions — показываем пока чат не начат */}
        {!chatStarted && (
          <div className={styles.suggested}>
            <p className={styles.suggestedTitle}>What is your question?</p>
            <div className={styles.cards}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <SuggestedQuestion
                  key={i}
                  question={q}
                  onClick={() => onSuggestedClick(q)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {chatStarted && messages && messages.length > 0 && (
          <div className={styles.messages}>
            {messages.map(msg => (
              <Message
                key={msg.id}
                text={msg.message}
                type={msg.type}
                timestamp={msg.create}
                isLoadingMessage={msg.isLoadingMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* Input */}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          typeInput='brand'
          id='message'
          name='message'
          type='text'
          placeholder='Enter your request...'
          disabled={isLoading}
          register={register}
          validationRules={{ required: true }}
        />
        <ButtonBlue
          type='submit'
          icon='/icons/send.svg'
          disabled={isLoading}
          iconProps={styles.buttonIcon}
          style={styles.sendButton}
        />
      </form>
    </div>
  )
}
