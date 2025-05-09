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
import {
  getNotificationStatus,
  handleNotifications,
} from '../../../initOneSignal'
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

  const [permission, setPermission] =
    useState<NotificationPermission | null>(null)

  const { isOpen, onToggle, onClose } = useDisclosure()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const fetchProfileData = useCallback(() => {
    const profileData = getSession(profileInfoString) as ProfileData

    if (isAdmin) {
      setProfileData(profileData as AdminInfo)
    } else {
      setProfileData(profileData as UserInfo)
    }
  }, [isAdmin])

  const logout = () => {
    const sessionToken = getSession(authTokenString)
    const authToken = getCookies(authTokenString)

    if (sessionToken) {
      removeSession(authTokenString)
    } else if (authToken) {
      removeCookies(authTokenString)
    }

    navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
  }

  const handleSwitchChange = async (isEnabled: boolean) => {
    const newPermission = await handleNotifications(isEnabled)

    setPermission(newPermission)

    showToast({
      title: isEnabled ? 'Уведомления включены' : 'Уведомления отключены',
      status: 'success',
    })
  }

  useEffect(() => {
    const checkStatus = async () => {
      const maxRetries = 5
      let attempts = 0

      while (attempts < maxRetries) {
        try {
          const permission = await getNotificationStatus()
          setPermission(permission)

          return
        } catch (error) {
          attempts++
          console.error(`❌ Попытка ${attempts} не удалась:`, error)
          await new Promise(res => setTimeout(res, 1000))
        }
      }

      console.error(
        '❌ Не удалось получить статус уведомлений после 3 попыток',
      )
      setPermission('default')
    }

    checkStatus()
  }, [])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

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
            {permission && (
              <div
                className={styles.notifications}
                onClick={() =>
                  handleSwitchChange(permission !== 'granted')
                }
              >
                <span className={styles.modalItem}>Notifications</span>
                <span
                  className={
                    permission === 'granted'
                      ? styles.notificationsOn
                      : styles.notificationsOff
                  }
                >
                  {permission === 'granted' ? 'On' : 'Off'}
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
