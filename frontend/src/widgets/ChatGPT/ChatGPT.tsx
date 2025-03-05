import './ChatGPT.scss'

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MessageChatGPT } from '../../app/constants/constants'
import { ChatGPTIcon } from '../../shared/icons/ChatGPTIcon'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../shared/ui/CustomCheckBox/CustomCheckBox'
import { Icon } from '../../shared/ui/Icon/Icon'
import { Input } from '../../shared/ui/Input/Input'
import { TransparentSelect } from '../../shared/ui/TransparentSelect/TransparentSelect'
import { getChatGPTInputData } from '../../shared/utils/api/Admin/ChatGPT/GetChatGPTInputData'
import { getUserHistoryMessage } from '../../shared/utils/api/Admin/ChatGPT/GetUserHistoryMessage'
import { postUserMessage } from '../../shared/utils/api/Admin/ChatGPT/PostUserMessage'
import { useChatGPT } from '../../shared/utils/Contexts/ChatGPTContext'
import styles from './ChatGPT.module.scss'
import { Message } from './Message/Message'

export const ChatGPT = () => {
  const { control, register, handleSubmit, setValue, reset } = useForm<{
    message: string
    model: string
    onTopic: boolean
  }>({
    defaultValues: { message: '', model: '', onTopic: false },
  })

  const [messages, setMessages] = useState<MessageChatGPT[] | null>(null)
  const [models, setModels] = useState<Record<number, string> | null>(null)
  const [showCheckbox, setShowCheckbox] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { i18n } = useTranslation()
  const { setChatGPTChangeForm } = useChatGPT()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const fetchData = useCallback(async () => {
    const [inputData, userHistory] = await Promise.all([
      getChatGPTInputData(),
      getUserHistoryMessage(),
    ])
    setModels(inputData.chatGPTModel)
    setMessages(userHistory.data)
  }, [])

  const sendMessage = async ({
    message,
    model,
    onTopic,
  }: {
    message: string
    model: string
    onTopic: boolean
  }) => {
    if (!model || message === '' || models === null) return

    setIsLoading(true)

    const currentDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    const userMessage: MessageChatGPT = {
      id: messages?.length || 0,
      message,
      type: 'in',
      create: currentDate,
    }

    reset({ message: '', model, onTopic })
    setMessages(prev => (prev ? [...prev, userMessage] : [userMessage]))

    let extraData = null

    if (onTopic) {
      const match = window.location.pathname.match(
        /\/admin\/business-plan\/(view|edit|make)-business-model\/(\d+)/,
      )
      if (match) extraData = { id: match[2], type: 'businessModel' }
    }

    const loadingMessage: MessageChatGPT = {
      id: (messages?.length || 0) + 1,
      message: 'ChatGPT has an answer for you',
      type: 'out',
      create: currentDate,
      isLoadingMessage: true,
    }

    setMessages(prev =>
      prev ? [...prev, loadingMessage] : [loadingMessage],
    )

    let dots = ''

    const interval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : ''
      setMessages(
        prev =>
          prev?.map(msg =>
            msg.id === loadingMessage.id
              ? { ...msg, message: `ChatGPT has an answer for you${dots}` }
              : msg,
          ) || [],
      )
    }, 500)

    const response = await postUserMessage(
      message,
      extraData?.id,
      extraData?.type,
      models[parseInt(model)],
    )

    if (onTopic) setChatGPTChangeForm(prev => !prev)

    clearInterval(interval)
    setMessages(
      prev =>
        prev
          ?.filter(msg => msg.id !== loadingMessage.id)
          .concat(response.data) || [response.data],
    )
    setIsLoading(false)
  }

  const groupMessagesByDate = (messages: MessageChatGPT[]) =>
    messages.reduce<Record<string, MessageChatGPT[]>>((acc, msg) => {
      const date = new Date(msg.create).toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(msg)

      return acc
    }, {})

  const groupedMessages = messages ? groupMessagesByDate(messages) : {}

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    const urlPatterns = [
      /\/admin\/business-plan\/view\/business-model\/(\d+)$/,
      /\/admin\/business-plan\/edit\/business-model\/(\d+)$/,
      /\/admin\/business-plan\/make-business-model\/?$/,
    ]
    setShowCheckbox(
      urlPatterns.some(pattern => pattern.test(window.location.pathname)),
    )
  }, [window.location.pathname])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (models && Object.keys(models).length > 0) {
      setValue('model', Object.keys(models)[0])
    }
  }, [models, setValue])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Popover
      closeOnBlur
      isOpen={isOpen}
      placement='bottom-end'
      returnFocusOnClose={false}
      onClose={onClose}
    >
      <PopoverTrigger>
        <div className={styles.wrapper}>
          <Icon icon={<ChatGPTIcon />} onIconClick={onToggle} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={styles.popoverContent}
        _focus={{
          outline: 'none',
          boxShadow: '1px 1px 8px #acb2f3',
          border: 'none',
        }}
        _active={{
          outline: 'none',
          boxShadow: '1px 1px 8px #acb2f3',
          border: 'none',
        }}
      >
        <PopoverHeader className={styles.popoverHeader}>
          <div className={styles.chatGPTContainer}>
            <Icon
              icon={<ChatGPTIcon />}
              hover={false}
              style={styles.iconChatGPT}
            />
            <span className={styles.chatGPTTitle}>ChatGPT</span>
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
        </PopoverHeader>
        <PopoverBody className={styles.popoverBody}>
          <div className={styles.messenger}>
            {messages && (
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
            <form
              className={styles.footer}
              onSubmit={handleSubmit(sendMessage)}
            >
              {showCheckbox && (
                <Controller
                  name='onTopic'
                  control={control}
                  render={({ field }) => (
                    <CustomCheckBox
                      title='On Topic'
                      isChecked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              <div className={styles.inputs}>
                <Input
                  typeInput='brand'
                  id='message'
                  name='message'
                  type='text'
                  disabled={isLoading}
                  register={register}
                  validationRules={{ required: true }}
                />
                <ButtonBlue
                  type='submit'
                  icon='/icons/send.svg'
                  disabled={isLoading}
                  style={styles.button}
                />
              </div>
            </form>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
