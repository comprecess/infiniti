import './ChatGPT.scss'

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
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

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { i18n } = useTranslation()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = async (data: {
    message: string
    model: string
    onTopic: boolean
  }) => {
    const { message, model, onTopic } = data

    if (!model || message === '' || models === null) return

    const currentDate = new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19)

    const userMessage: MessageChatGPT = {
      id: messages?.length || 0,
      message,
      type: 'in',
      create: currentDate,
    }

    reset({ message: '', model: data.model, onTopic: data.onTopic })
    setMessages(prev => (prev ? [...prev, userMessage] : [userMessage]))

    let extraData = null

    if (onTopic) {
      const urlPatterns = [
        /\/admin\/business-plan\/view\/business-model\/(\d+)$/,
        /\/admin\/business-plan\/edit\/business-model\/(\d+)$/,
      ]

      let match = null

      for (const pattern of urlPatterns) {
        match = window.location.pathname.match(pattern)
        if (match) break
      }

      if (match) {
        extraData = { id: match[1], type: 'businessModel' }
      }
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
      setMessages(prev =>
        prev
          ? prev.map(msg =>
              msg.id === loadingMessage.id
                ? {
                    ...msg,
                    message: `ChatGPT has an answer for you${dots}`,
                  }
                : msg,
            )
          : [],
      )
    }, 500)

    const response: { data: MessageChatGPT } = await postUserMessage(
      models[parseInt(model)],
      message,
      extraData?.id,
      extraData?.type,
    )

    clearInterval(interval)
    setMessages(prev =>
      prev
        ? [
            ...prev.filter(msg => msg.id !== loadingMessage.id),
            response.data,
          ]
        : [response.data],
    )
  }

  const getInputData = async () => {
    const response: { chatGPTModel: Record<number, string> } =
      await getChatGPTInputData()

    setModels(response.chatGPTModel)
  }

  const getHistoryUser = async () => {
    const response: { data: MessageChatGPT[] } =
      await getUserHistoryMessage()

    setMessages(response.data)
  }

  const groupMessagesByDate = (messages: MessageChatGPT[]) => {
    return messages.reduce<Record<string, MessageChatGPT[]>>(
      (acc, msg) => {
        const date = new Date(msg.create).toLocaleDateString(
          i18n.language,
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        )

        if (!acc[date]) {
          acc[date] = []
        }

        acc[date].push(msg)

        return acc
      },
      {},
    )
  }

  const groupedMessages = messages ? groupMessagesByDate(messages) : {}

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (models && Object.keys(models).length > 0) {
      const firstModelValue = Object.keys(models)[0]
      setValue('model', firstModelValue)
    }
  }, [models, setValue])

  useEffect(() => {
    const urlPatterns = [
      /\/admin\/business-plan\/view\/business-model\/(\d+)$/,
      /\/admin\/business-plan\/edit\/business-model\/(\d+)$/,
    ]

    setShowCheckbox(
      urlPatterns.some(pattern => pattern.test(window.location.pathname)),
    )

    getHistoryUser()
  }, [window.location.pathname])

  useEffect(() => {
    getInputData()
  }, [])

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
        style={{
          borderRadius: 8,
          background: 'transparent',
          outline: 'none',
          boxShadow: '1px 1px 7px #838ced',
          border: 'none',
        }}
      >
        <PopoverHeader
          className={styles.popoverHeader}
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            background:
              'linear-gradient(to right, #838ced, #5965e7, #303fe1)',
            borderBottom: 'none',
            padding: '18px 24px',
          }}
        >
          <div className={styles.chatGPTContainer}>
            <Icon
              hover={false}
              icon={<ChatGPTIcon />}
              style={styles.iconChatGPT}
            />
            <span className={styles.chatGPTTitle}>ChatGPT</span>
          </div>
          {models && (
            <div>
              <Controller
                name='model'
                control={control}
                render={({ field }) => (
                  <TransparentSelect
                    value={field.value}
                    options={Object.entries(models).map(
                      ([key, value]) => ({
                        value: key,
                        label: value,
                      }),
                    )}
                    onChange={selectedValue =>
                      field.onChange(selectedValue)
                    }
                  />
                )}
              />
            </div>
          )}
        </PopoverHeader>
        <PopoverBody
          className={styles.popoverBody}
          style={{
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: '#151720',
          }}
        >
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
                  register={register}
                  validationRules={{ required: true }}
                />
                <ButtonBlue
                  type='submit'
                  icon='/icons/send.svg'
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
