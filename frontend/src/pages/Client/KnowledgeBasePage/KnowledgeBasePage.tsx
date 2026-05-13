import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './KnowledgeBasePage.module.scss'
import { MessageChatGPT } from '../../../app/constants/constants'
import { Message } from '../../../widgets/ChatGPT/Message/Message'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { TransparentSelect } from '../../../shared/ui/TransparentSelect/TransparentSelect'
import { getKBInputData } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-input-data'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'

export const ClientKnowledgeBasePage = () => {
  const { control, register, handleSubmit, setValue, reset } = useForm<{
    message: string
    model: string
  }>({
    defaultValues: { message: '', model: '' },
  })

  const [messages, setMessages] = useState<MessageChatGPT[] | null>(null)
  const [models, setModels]     = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { i18n } = useTranslation()

  const fetchData = useCallback(async () => {
    const [inputData, history] = await Promise.all([
      getKBInputData(),
      getKBHistory(),
    ])

    if (inputData.status) {
      const modelList: string[] = inputData.data.chatGPTModel ?? []
      setModels(modelList)
      if (modelList.length > 0) setValue('model', modelList[0])
    }

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
  }, [setValue])

  const sendMessage = async ({ message, model }: { message: string; model: string }) => {
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const userMessage: MessageChatGPT = {
      id:      Date.now(),
      message,
      type:    'in',
      create:  currentDate,
    }

    reset({ message: '', model })
    setMessages(prev => (prev ? [...prev, userMessage] : [userMessage]))

    const loadingMessage: MessageChatGPT = {
      id:                Date.now() + 1,
      message:           'Infiniti AI is thinking',
      type:              'out',
      create:            currentDate,
      isLoadingMessage:  true,
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

    const response = await postKBMessage(message, model)

    clearInterval(interval)

    if (response.status) {
      const aiMessage: MessageChatGPT = {
        id:      response.data.data?.id ?? Date.now() + 2,
        message: response.data.data?.message ?? '',
        type:    'out',
        create:  response.data.data?.create ?? currentDate,
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
          <img src='/icons/knowledge-base.svg' alt='' className={styles.headerIcon} onError={e => (e.currentTarget.style.display = 'none')} />
          <span className={styles.headerTitle}>Knowledge Base</span>
        </div>
        {models && models.length > 0 && (
          <Controller
            name='model'
            control={control}
            render={({ field }) => (
              <TransparentSelect
                value={field.value}
                options={models.map((m, i) => ({ value: m, label: m }))}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>

      {/* Messages area */}
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
