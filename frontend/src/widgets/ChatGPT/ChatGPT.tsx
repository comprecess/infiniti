import './ChatGPT.scss'

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'

import { ChatGPTIcon } from '../../shared/icons/ChatGPTIcon'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../shared/ui/CustomInput/CustomInput'
import { Icon } from '../../shared/ui/Icon/Icon'
import styles from './ChatGPT.module.scss'

export const ChatGPT = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()

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
            <div className={styles.messages}>Messages</div>
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
