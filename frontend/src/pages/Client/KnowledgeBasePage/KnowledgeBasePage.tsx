import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './KnowledgeBasePage.module.scss'
import { MessageChatGPT } from '../../../app/constants/constants'
import { Message } from '../../../widgets/ChatGPT/Message/Message'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'

export const ClientKnowledgeBasePage = () => {
  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  })

  const [messages, setMessages] = useState<MessageChatGPT[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    } else {
      setMessages([])
    }
  }, [])

  const sendMessage = async ({ message }: { message: string }) => {
    if (!message.trim() || isLoading) return

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
      const aiMessage: MessageChatGPT = {
        id:      aiMsg?.id ?? Date.now() + 2,
        message: aiMsg?.message ?? '',
        type:    'out',
        create:  aiMsg?.create ?? currentDate,
      }
      setMessages(prev =>
        prev
          ? prev.filter(m => m.id !== loadingMessage.id).concat(aiMessage)
          : [aiMessage],
      )
    } else {
      setMessages(prev => prev?.filter(m => m.id !== loadingMessage.id) ?? [])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
  }, [])

  return (
    <div className={styles.wrapper}>
      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages === null ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>Loading...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Ask Infiniti AI</p>
            <p className={styles.emptyText}>
              Ask any question about the platform — leads, projects, invoices, HRM and more.
            </p>
          </div>
        ) : (
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
      <form className={styles.form} onSubmit={handleSubmit(sendMessage)}>
        <Input
          typeInput='brand'
          id='message'
          name='message'
          type='text'
          placeholder='Ask a question about the platform...'
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
