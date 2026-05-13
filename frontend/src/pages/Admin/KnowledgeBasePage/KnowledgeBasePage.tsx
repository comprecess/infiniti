import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './KnowledgeBasePage.module.scss'
import { MessageChatGPT } from '../../../app/constants/constants'
import { Message } from '../../../widgets/ChatGPT/Message/Message'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { TransparentSelect } from '../../../shared/ui/TransparentSelect/TransparentSelect'
import { getChatGPTInputData } from '../../../shared/utils/api/Admin/ChatGPT/get-chat-gpt-input-data'
import { getHistoryUserMessage } from '../../../shared/utils/api/Admin/ChatGPT/get-history-user-message'
import { postCreateUserMessage } from '../../../shared/utils/api/Admin/ChatGPT/post-create-user-message'

export const AdminKnowledgeBasePage = () => {
  const { control, register, handleSubmit, setValue, reset } = useForm<{
    message: string
    model: string
  }>({
    defaultValues: { message: '', model: '' },
  })

  const [messages, setMessages] = useState<MessageChatGPT[] | null>(null)
  const [models, setModels]     = useState<Record<number, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { i18n } = useTranslation()

  const fetchData = useCallback(async () => {
    const [inputData, history] = await Promise.all([
      getChatGPTInputData(),
      getHistoryUserMessage(),
    ])

    if (inputData.status) {
      setModels(inputData.data.chatGPTModel)
    }

    if (history.status) {
      setMessages(history.data?.data ?? [])
    } else {
      setMessages([])
    }
  }, [])

  const sendMessage = async ({ message, model }: { message: string; model: string }) => {
    if (!message.trim() || isLoading || models === null) return

    setIsLoading(true)
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const userMessage: MessageChatGPT = {
      id:     Date.now(),
      message,
      type:   'in',
      create: currentDate,
    }

    reset({ message: '', model })
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

    const response = await postCreateUserMessage(
      message,
      undefined,
      undefined,
      models[parseInt(model)],
    )

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

  const groupMessagesByDate = (msgs: MessageChatGPT[]) =>
    msgs.reduce<Record<string, MessageChatGPT[]>>((acc, msg) => {
      const date = new Date(msg.create).toLocaleDateString(i18n.language, {
        day:   '2-digit',
        month: 'long',
        year:  'numeric',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(msg)
      return acc
    }, {})

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (models && Object.keys(models).length > 0) {
      setValue('model', Object.keys(models)[0])
    }
  }, [models, setValue])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
  }, [])

  const groupedMessages = messages ? groupMessagesByDate(messages) : {}

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerTitle}>Knowledge Base</span>
        </div>
        {models && (
          <Controller
            name='model'
            control={control}
            render={({ field }) => (
              <TransparentSelect
                value={field.value}
                options={Object.entries(models).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages === null ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>Loading...</span>
          </div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Ask Infiniti AI</p>
            <p className={styles.emptyText}>
              Ask any question about the platform — leads, projects, invoices, HRM and more.
            </p>
          </div>
        ) : (
          <div className={styles.messages}>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className={styles.dateSeparator}>{date}</div>
                {msgs.map(msg => (
                  <Message
                    key={msg.id}
                    text={msg.message}
                    type={msg.type}
                    timestamp={msg.create}
                    isLoadingMessage={msg.isLoadingMessage}
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form className={styles.form} onSubmit={handleSubmit(sendMessage)}>
        <div className={styles.inputRow}>
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
        </div>
      </form>
    </div>
  )
}
