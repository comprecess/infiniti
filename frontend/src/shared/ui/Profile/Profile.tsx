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

import {
  AdminInfo,
  authTokenString,
  notificationTokenString,
  profileInfoString,
  UserInfo,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { subscribeOneSignal } from '../../../oneSignalService'
import { getDevicePush } from '../../utils/api/Push/get-device-push'
import { patchSetDevicePush } from '../../utils/api/Push/patch-set-device-push'
import { postKeyPush } from '../../utils/api/Push/post-key-push'
import { postUnsubPush } from '../../utils/api/Push/post-unsub-push'
import { useDeviceDetect } from '../../utils/hooks/useDeviceDetect'
import { getCookies } from '../../utils/Saving/Cookies/GetCookies'
import { removeCookies } from '../../utils/Saving/Cookies/RemoveCookies'
import { getSession } from '../../utils/Saving/Session/GetSession'
import { removeSession } from '../../utils/Saving/Session/RemoveSession'
import { useCustomToast } from '../CustomToast/CustomToast'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import styles from './Profile.module.scss'

interface ProfileProps {
  isAdmin?: boolean
}

type ProfileData = UserInfo | AdminInfo

export const Profile = ({ isAdmin }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { deviceModel, os, browser, isMobile } = useDeviceDetect()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const notificationToken = getCookies(notificationTokenString)
  const sessionToken = getSession(authTokenString)
  const authToken = getCookies(authTokenString)

  const fetchProfileData = useCallback(async () => {
    const profileData = getSession(profileInfoString) as ProfileData

    if (isAdmin) {
      setProfileData(profileData as AdminInfo)
    } else {
      setProfileData(profileData as UserInfo)
    }
  }, [isAdmin])

  const fetchPushNotifications = useCallback(async () => {
    if (isMobile && !sessionToken && notificationToken.status) {
      try {
        const response = await getDevicePush(
          notificationToken.cookie || '',
        )

        if (response.status) {
          setIsSubscribed(response.data.data.enabled === 1 ? true : false)
        } else {
          setIsSubscribed(false)
        }
      } catch (error) {
        setIsSubscribed(false)
      }
    }

    setIsLoading(false)
  }, [isMobile])

  const logout = async () => {
    try {
      if (isMobile && !sessionToken && notificationToken.status) {
        await patchSetDevicePush(notificationToken.cookie || '', 0)
        await postUnsubPush(notificationToken.cookie || '')
      }

      if (sessionToken) {
        removeSession(authTokenString)
      } else if (authToken) {
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

  const toggleNotificationSubscription = async (isSubscribed: boolean) => {
    if (isMobile) {
      setIsLoading(true)

      if (!notificationToken.status) {
        await subscribeOneSignal(`${os}, ${deviceModel}, ${browser}`)
      } else {
        await postKeyPush(
          notificationToken.cookie || '',
          `${os}, ${deviceModel}, ${browser}`,
        )
        await patchSetDevicePush(
          notificationToken.cookie || '',
          isSubscribed === true ? 1 : 0,
        )
      }

      setTimeout(() => {
        fetchPushNotifications()
      }, 2000)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [isAdmin])

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
          {profileData ? (
            <>
              <span className={styles.name}>
                {profileData.account ? profileData.account : '-'}
              </span>
              <div className={styles.avatar}>
                <img
                  alt='Profile Avatar'
                  src={
                    profileData.img
                      ? `${profileData.img}?width=128&height=128`
                      : '/profileWithoutAvatar.svg'
                  }
                />
              </div>
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </PopoverTrigger>
      {profileData && (
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
              background:
                'linear-gradient(to right, #838ced, #5965e7, #303fe1)',
              borderBottom: 'none',
              padding: '18px 24px',
            }}
          >
            <div className={styles.modalAvatar}>
              <img
                alt='Profile Avatar'
                style={{ width: '60px', height: '60px' }}
                src={
                  profileData.img
                    ? `${profileData.img}?width=128&height=128`
                    : '/profileWithoutAvatar.svg'
                }
              />
            </div>
            <div className={styles.accountInfo}>
              <p className={styles.modalName}>{profileData.account}</p>
              <p className={styles.modalEmail}>{profileData.email}</p>
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
                if (profileData.userType === 'Admin') {
                  navigate(
                    `/${Routes.adminPages}/${Routes.profile}/${Routes.settings}`,
                  )
                } else {
                  navigate(
                    `/${Routes.clientPages}/${Routes.settings}/${Routes.profile}`,
                  )
                }
                onClose()
              }}
            >
              Settings
            </span>
            {isMobile && !sessionToken && (
              <div
                className={`${styles.modalItem} ${styles.notifications}`}
                onClick={() =>
                  toggleNotificationSubscription(!isSubscribed)
                }
              >
                <span>Notifications</span>
                {isLoading ? (
                  <LoadingSpinner size='sm' />
                ) : (
                  <span
                    className={
                      isSubscribed === true
                        ? styles.notificationsOn
                        : styles.notificationsOff
                    }
                  >
                    {isSubscribed === true ? 'On' : 'Off'}
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
