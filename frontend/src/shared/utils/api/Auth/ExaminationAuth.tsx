import { PropsWithChildren, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { authTokenString, roles } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { subscribeNavigation } from '../../hooks/navigationService'
import { removeCookies } from '../../Saving/Cookies/RemoveCookies'
import { getProfileInfo } from '../get-profile-info'

export const ExaminationAuth = ({ children }: PropsWithChildren) => {
  const [isUserRole, setIsUserRole] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getProfileInfo()

        if (!user.status) return

        if (user) {
          const isAuth = !!user
          const userRole = user.data.userType

          setIsUserRole(userRole)
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
    if (!isLoading && isAuthenticated) {
      if (isUserRole === roles.client) {
        navigate(`/${Routes.clientPages}/${Routes.dashboard}`)
      } else if (isUserRole === roles.admin) {
        navigate(`/${Routes.adminPages}/${Routes.dashboard}`)
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
    }
  }, [isLoading, isAuthenticated, isUserRole])

  useEffect(() => {
    const unsubscribe = subscribeNavigation(path => {
      navigate(path)
    })

    return () => {
      typeof unsubscribe === 'function' && unsubscribe()
    }
  }, [navigate])

  return !isAuthenticated && !isLoading ? <>{children}</> : null
}
