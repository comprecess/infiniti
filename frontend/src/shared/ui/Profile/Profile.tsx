import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Profile.module.scss'
import {
  authTokenString,
  UserInfo,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { subscribeVapidPush, getVapidSubscriptionEndpoint } from '../../../vapidPushService'
import { useDeviceDetect } from '../../utils/hooks/useDeviceDetect'
import { removeCookies } from '../../utils/Saving/Cookies/RemoveCookies'
import { getSession } from '../../utils/Saving/Session/GetSession'
import { removeSession } from '../../utils/Saving/Session/RemoveSession'
import { getCookies } from '../../utils/Saving/Cookies/GetCookies'
import { useCustomToast } from '../CustomToast/CustomToast'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'

interface ProfileProps {
  user: UserInfo | null
}

export const Profile = ({ user }: ProfileProps) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { deviceModel, os, browser, isMobile } = useDeviceDetect()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const sessionToken = getSession(authTokenString)
  const authToken = getCookies(authTokenString)

  // Check subscription status via Service Worker
  const fetchPushNotifications = useCallback(async () => {
    if (isMobile && !sessionToken) {
      try {
        const endpoint = await getVapidSubscriptionEndpoint()
        setIsSubscribed(!!endpoint)
      } catch {
        setIsSubscribed(false)
      }
    }
    setIsLoading(false)
  }, [isMobile, sessionToken])

  const logout = async () => {
    try {
      if (isMobile && !sessionToken) {
        const endpoint = await getVapidSubscriptionEndpoint()
        if (endpoint) {
          await patchSetDevicePush(encodeURIComponent(endpoint), 0)
          await postUnsubPush(encodeURIComponent(endpoint))
        }
      }

      if (sessionToken) {
        removeSession(authTokenString)
      } else if (authToken.status) {
        removeCookies(authTokenString)
      }

      navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
    } catch (error) {
      showToast({
        title: 'Error',
        description: `Logout error: ${error}`,
        status: 'error',
      })
    }
  }

  const toggleNotificationSubscription = async () => {
    if (!isMobile || sessionToken) return

    setIsLoading(true)
    try {
      if (!isSubscribed) {
        // Subscribe
        const ok = await subscribeVapidPush(`${os}, ${deviceModel}, ${browser}`)
        if (ok) {
          setIsSubscribed(true)
          showToast({ title: 'Notifications enabled', status: 'success' })
        } else {
          showToast({ title: 'Could not enable notifications', description: 'Please allow notifications in browser settings', status: 'warning' })
        }
      } else {
        // Unsubscribe — just remove from browser, no broken API calls
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration('/sw.js')
          if (reg) {
            const sub = await reg.pushManager.getSubscription()
            if (sub) await sub.unsubscribe()
          }
        }
        setIsSubscribed(false)
        showToast({ title: 'Notifications disabled', status: 'info' })
      }
    } catch (err) {
      showToast({ title: 'Error', description: String(err), status: 'error' })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPushNotifications()
  }, [isMobile, isOpen])

  return (
    <Popover
      closeOnBlur
      isOpen={isOpen}
      placement='bottom-end'
      returnFocusOnClose={false}
      onClose={onClose}
    >
      <PopoverTrigger>
        <div className={styles.wrapper} onClick={onToggle}>
          {user ? (
            <>
              <span className={styles.name}>{user.account ? user.account : '-'}</span>
              <div className={styles.avatar}>
                <img
                  alt='Profile Avatar'
                  src={user.img ? `${user.img}?width=128&height=128` : '/profileWithoutAvatar.svg'}
                />
              </div>
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </PopoverTrigger>
      {user && (
        <PopoverContent
          zIndex={9999}
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
              width: '100%',
              gap: 12,
              alignItems: 'center',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              background: 'linear-gradient(to right, #838ced, #5965e7, #303fe1)',
              borderBottom: 'none',
              padding: '18px 24px',
            }}
          >
            <div className={styles.modalAvatar}>
              <img
                alt='Profile Avatar'
                style={{ width: '60px', height: '60px' }}
                src={user.img ? `${user.img}?width=128&height=128` : '/profileWithoutAvatar.svg'}
              />
            </div>
            <div className={styles.accountInfo}>
              <p className={styles.modalName}>{user.account}</p>
              <p className={styles.modalEmail}>{user.email}</p>
            </div>
          </PopoverHeader>
          <PopoverBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              backgroundColor: '#151720',
            }}
          >
            <span
              className={styles.modalItem}
              onClick={() => {
                if (user.userType === 'Admin') {
                  navigate(`/${Routes.adminPages}/${Routes.profile}/${Routes.settings}`)
                } else {
                  navigate(`/${Routes.clientPages}/${Routes.settings}/${Routes.profile}`)
                }
                onClose()
              }}
            >
              Settings
            </span>
            {isMobile && !sessionToken && (
              <div
                className={`${styles.modalItem} ${styles.notifications}`}
                onClick={toggleNotificationSubscription}
              >
                <span>Notifications</span>
                {isLoading ? (
                  <LoadingSpinner size='sm' />
                ) : (
                  <span
                    className={
                      isSubscribed ? styles.notificationsOn : styles.notificationsOff
                    }
                  >
                    {isSubscribed ? 'On' : 'Off'}
                  </span>
                )}
              </div>
            )}
            <span className={styles.modalItem} onClick={logout}>
              Logout
            </span>
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  )
}
