import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { roles } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { getProfileInfo } from '../GetProfileInfo'

export const ExaminationUser: FC<PropsWithChildren> = ({ children }) => {
  const [isUserRole, setIsUserRole] = useState<string>('')
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

          setIsUserRole(userRole)
          setIsAuthenticated(isAuth)
        }
      } catch (error: any) {
        navigate(`$/${Routes.auth}/${Routes.sign}/${Routes.in}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`$/${Routes.auth}/${Routes.sign}/${Routes.in}`)
    } else if (!isLoading && isAuthenticated) {
      if (isUserRole === roles.client) {
        if (location.pathname.includes(`/${Routes.clientPages}`)) {
          navigate(location.pathname)
        } else {
          navigate(`/${Routes.clientPages}/${Routes.dashboard}`)
        }
      } else if (isUserRole === roles.admin) {
        if (location.pathname.includes(`/${Routes.adminPages}`)) {
          navigate(location.pathname)
        } else {
          navigate(`/${Routes.adminPages}/${Routes.dashboard}`)
        }
      }
    }
  }, [isLoading, isAuthenticated, isUserRole])

  return isAuthenticated && !isLoading ? <>{children}</> : null
}
