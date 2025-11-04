import { cloneElement, PropsWithChildren, ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { authTokenString, roles } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { subscribeNavigation } from '../../hooks/navigationService'
import { removeCookies } from '../../Saving/Cookies/RemoveCookies'
import { getProfileInfo } from '../get-profile-info'

interface ChildProps {
  listRoles?: {
    [key: string]: {
      view: number
      edit: number
      create: number
      delete: number
      all: number
    }
  }
}

interface WithRoles {
  roles?: ChildProps
}

export const ExaminationUser = ({ children }: PropsWithChildren) => {
  const [userRole, setUserRole] = useState<string>('')
  const [listRoles, setListRoles] = useState<ChildProps>()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  const location = useLocation()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getProfileInfo()

        if (!user.status) return

        if (user) {
          const isAuth = !!user
          const userRole = user.data.userType

          setListRoles(user.data.role)
          setUserRole(userRole)
          setIsAuthenticated(isAuth)
        }
      } catch (error: any) {
        removeCookies(authTokenString)
        navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
    } else if (!isLoading && isAuthenticated) {
      if (userRole === roles.client) {
        if (location.pathname.includes(`/${Routes.clientPages}`)) {
          navigate(`${location.pathname}${location.search}`)
        } else {
          navigate(`/${Routes.clientPages}/${Routes.dashboard}`)
        }
      } else if (userRole === roles.admin) {
        if (location.pathname.includes(`/${Routes.adminPages}`)) {
          navigate(`${location.pathname}${location.search}`)
        } else {
          navigate(`/${Routes.adminPages}/${Routes.dashboard}`)
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole])

  useEffect(() => {
    const unsubscribe = subscribeNavigation(path => {
      navigate(path)
    })

    return () => {
      typeof unsubscribe === 'function' && unsubscribe()
    }
  }, [navigate])

  if (isAuthenticated && !isLoading && userRole === roles.admin) {
    return cloneElement(children as ReactElement<WithRoles>, {
      roles: listRoles,
    })
  }

  if (isAuthenticated && !isLoading && userRole === roles.client) {
    return <>{children}</>
  }

  return null
}
