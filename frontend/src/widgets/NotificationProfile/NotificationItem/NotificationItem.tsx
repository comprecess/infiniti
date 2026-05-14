import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './NotificationItem.module.scss'
import { Notifications } from '../../../app/constants/constants'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'

interface NotificationItemProps {
  notification: Notifications
  notificationIsViewed: (id: number) => void
}

export const NotificationItem = ({
  notification,
  notificationIsViewed,
}: NotificationItemProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  const clearMessage = sanitizeMessage(notification.message)

  const handleClick = () => {
    if (notification.link) {
      navigate(notification.link)
    }
  }

  useEffect(() => {
    if (!ref.current || notification.viewed === 1) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timeoutRef.current = setTimeout(() => {
              notificationIsViewed(notification.id)
            }, 4000)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [notification])

  return (
    <div
      ref={ref}
      className={
        notification.viewed === 1
          ? styles.wrapperDisable
          : styles.wrapperActive
      }
      onClick={handleClick}
      style={notification.link ? { cursor: 'pointer' } : undefined}
    >
      <div
        dangerouslySetInnerHTML={{ __html: clearMessage }}
        className='dangerouslySetInnerHTML'
      />
      <div className={styles.time}>{notification.dateCreate}</div>
    </div>
  )
}
