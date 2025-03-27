import {
  cloneElement,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { roles } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { getProfileInfo } from '../GetProfileInfo'

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

        if (user) {
          const isAuth = !!user
          const userRole = user?.userType

          setListRoles(user.role)
          setUserRole(userRole)
          setIsAuthenticated(isAuth)
        }
      } catch (error: any) {
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
          navigate(location.pathname)
        } else {
          navigate(`/${Routes.clientPages}/${Routes.dashboard}`)
        }
      } else if (userRole === roles.admin) {
        if (location.pathname.includes(`/${Routes.adminPages}`)) {
          navigate(location.pathname)
        } else {
          navigate(`/${Routes.adminPages}/${Routes.dashboard}`)
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole])

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
