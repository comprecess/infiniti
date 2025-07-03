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
  profileInfoString,
  UserInfo,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { subscribeOneSignal } from '../../../oneSignalService'
import { getUserSettings } from '../../utils/api/GetUserSettings'
import { patchSetUserSettings } from '../../utils/api/PatchSetUserSettings'
import { postPushUnsubscribed } from '../../utils/api/Push/PostPushUnsubscribed'
import { getCookies } from '../../utils/Saving/Cookies/GetCookies'
import { removeCookies } from '../../utils/Saving/Cookies/RemoveCookies'
import { getSession } from '../../utils/Saving/Session/GetSession'
import { removeSession } from '../../utils/Saving/Session/RemoveSession'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import styles from './Profile.module.scss'

interface ProfileProps {
  isAdmin?: boolean
}

type ProfileData = UserInfo | AdminInfo

export const Profile = ({ isAdmin }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { isOpen, onToggle, onClose } = useDisclosure()

  const navigate = useNavigate()

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
    if (isMobile) {
      const { push }: { push: boolean } = await getUserSettings()

      setIsSubscribed(push)
    } else {
      setIsSubscribed(null)
    }
  }, [isMobile])

  const logout = useCallback(async () => {
    if (isMobile && !sessionToken) {
      await postPushUnsubscribed()
    }

    if (sessionToken) removeSession(authTokenString)
    else if (authToken) removeCookies(authTokenString)

    navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
  }, [isMobile, sessionToken, authToken])

  const toggleNotificationSubscription = async (isSubscribed: boolean) => {
    if (isMobile && isSubscribed) {
      try {
        await subscribeOneSignal()
      } catch (error) {
        console.error(
          '❌ Ошибка при загрузке OneSignal SDK или получении данных:',
          error,
        )
      } finally {
        await patchSetUserSettings({ push: isSubscribed })
        fetchPushNotifications()
      }
    } else {
      await patchSetUserSettings({ push: isSubscribed })
      fetchPushNotifications()
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        )

      const hasTouch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0

      const isSmallScreen = window.innerWidth <= 768
      const isPortrait = window.matchMedia(
        '(orientation: portrait)',
      ).matches

      const mobileCheck =
        isMobileUserAgent && hasTouch && isSmallScreen && isPortrait

      setIsMobile(mobileCheck)
    }

    checkMobile()
  }, [])

  useEffect(() => {
    fetchPushNotifications()
  }, [isMobile])

  useEffect(() => {
    fetchProfileData()
  }, [isAdmin])

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
                src={
                  profileData.img
                    ? `${profileData.img}?width=128&height=128`
                    : '/profileWithoutAvatar.svg'
                }
              />
            </div>
            <div>
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
            <span className={styles.modalItem}>Edit Profile</span>
            <span className={styles.modalItem}>Change Password</span>
            {isMobile && !sessionToken && isSubscribed !== null && (
              <div
                className={`${styles.modalItem} ${styles.notifications}`}
                onClick={() =>
                  toggleNotificationSubscription(!isSubscribed)
                }
              >
                <span>Notifications</span>
                <span
                  className={
                    isSubscribed === true
                      ? styles.notificationsOn
                      : styles.notificationsOff
                  }
                >
                  {isSubscribed === true ? 'On' : 'Off'}
                </span>
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
