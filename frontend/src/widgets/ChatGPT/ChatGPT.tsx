import './ChatGPT.scss'

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect } from 'react'

import { ChatGPTIcon } from '../../shared/icons/ChatGPTIcon'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../shared/ui/CustomInput/CustomInput'
import { Icon } from '../../shared/ui/Icon/Icon'
import { TransparentSelect } from '../../shared/ui/TransparentSelect/TransparentSelect'
import styles from './ChatGPT.module.scss'
import { Message } from './Message/Message'

const messages = [
  { id: 1, text: 'Привет! Как дела?', isMy: false },
  { id: 2, text: 'Привет! Все отлично, спасибо!', isMy: true },
  { id: 3, text: 'Ты знаешь, что я ChatGPT?', isMy: false },
  { id: 4, text: 'Конечно! А что ты умеешь?', isMy: true },
  { id: 5, text: 'Все!', isMy: false },
  {
    id: 6,
    text: 'Вооу...',
    isMy: true,
  },
  {
    id: 7,
    text: 'Могу помочь с кодом, ответить на вопросы, даже поддержать беседу.',
    isMy: false,
  },
  {
    id: 8,
    text: 'Звучит круто! А ты можешь рассказать анекдот?',
    isMy: true,
  },
  {
    id: 9,
    text: 'Конечно! Почему программисты не любят природу?',
    isMy: false,
  },
  { id: 10, text: 'Хм, почему?', isMy: true },
  { id: 11, text: 'Потому что там слишком много багов! 😆', isMy: false },
  { id: 12, text: 'Ахаха, неплохо! А ты знаешь про React?', isMy: true },
  {
    id: 13,
    text: 'Конечно! Это библиотека для создания пользовательских интерфейсов.',
    isMy: false,
  },
  {
    id: 14,
    text: 'А как правильно управлять состоянием в React?',
    isMy: true,
  },
  {
    id: 15,
    text: 'Можно использовать useState, useReducer или глобальное хранилище, например Redux или React Query.',
    isMy: false,
  },
]

export const ChatGPT = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

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
          <div>
            <TransparentSelect
              value={'test1'}
              options={[
                { value: 'test1', label: 'gpt 3.5' },
                { value: 'test2', label: 'gpt 3.5 turbo' },
                { value: 'test3', label: 'gpt 4.0' },
              ]}
              onChange={() => {}}
            />
          </div>
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
            <div className={styles.messages}>
              {messages.map(msg => {
                return (
                  <Message key={msg.id} text={msg.text} isMy={msg.isMy} />
                )
              })}
            </div>
            <div className={styles.input}>
              <CustomInput type='text' onChange={() => {}} />
              <ButtonBlue icon='/icons/send.svg' style={styles.button} />
            </div>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
