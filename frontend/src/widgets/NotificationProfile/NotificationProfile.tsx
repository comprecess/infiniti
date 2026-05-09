import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { NotificationItem } from './NotificationItem/NotificationItem'
import styles from './NotificationProfile.module.scss'
import { Notifications } from '../../app/constants/constants'
import { NotificationIndicatorIcon } from '../../shared/icons/NotificationIndicatorIcon'
import { Icon } from '../../shared/ui/Icon/Icon'
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getNotifications } from '../../shared/utils/api/Admin/Notifications/get-notifications'
import { putNotificationsViewed } from '../../shared/utils/api/Admin/Notifications/put-notifications-viewed'
import { useAppWebSocket } from '../../shared/utils/providers/WebSocketProvider'

export const NotificationProfile = () => {
  const [notifications, setNotifications] = useState<Notifications[] | null>(null)

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false)

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { isConnected, isAuth, on } = useAppWebSocket()

  const handleGetNotifications = async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const response = await getNotifications(timeZone)

    if (!response.status) return

    if (response.data.data) {
      const hasUnread = response.data.data.some(
        (notification: { viewed: number }) => notification.viewed === 0,
      )

      setHasUnreadNotifications(hasUnread)
    }

    setNotifications(response.data.data)
  }

  const handleNotificationViewed = async (id: number) => {
    await putNotificationsViewed([id])

    setNotifications(prev =>
      prev
        ? prev.map(notification =>
          notification.id === id ? { ...notification, viewed: 1 } : notification,
        )
        : prev,
    )
  }

  useEffect(() => {
    if (isOpen) {
      handleGetNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isConnected || !isAuth) return

    on('notification', handleGetNotifications)

    return () => {
      on('notification', () => {})
    }
  }, [isConnected, isAuth, on])

  return (
    <Popover
      closeOnBlur
      placement='bottom-end'
      isOpen={isOpen}
      returnFocusOnClose={false}
      onClose={onClose}
    >
      <PopoverTrigger>
        <div className={styles.wrapper}>
          <Icon
            icon={<NotificationIndicatorIcon />}
            style={hasUnreadNotifications ? styles.iconNotification : ''}
            onIconClick={onToggle}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        width={{ base: 'calc(100vw - 24px)', md: '350px' }}
        zIndex={9999}
        sx={{
          '@media (max-width: 768px)': {
            left: '12px !important',
            right: '12px !important',
            maxWidth: 'calc(100vw - 24px) !important',
          }
        }}
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
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            background: 'linear-gradient(to right, #838ced, #5965e7, #303fe1)',
            borderBottom: 'none',
            padding: '18px 24px',
          }}
        >
          <p className={styles.notifications}>Notifications</p>
        </PopoverHeader>
        <PopoverBody
          paddingRight='4px'
          paddingLeft='12px'
          paddingTop='8px'
          paddingBottom='8px'
          maxHeight='300px'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: '#151720',
          }}
        >
          {notifications ? (
            notifications.length > 0 ? (
              <div className={styles.notificationsList}>
                {notifications.map(item => {
                  return (
                    <NotificationItem
                      key={item.id}
                      notification={item}
                      notificationIsViewed={handleNotificationViewed}
                    />
                  )
                })}
              </div>
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )
          ) : (
            <div className={styles.loading}>
              <LoadingSpinner />
            </div>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
