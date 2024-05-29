import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { roles } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { getProfileInfo } from '../Profile/GetProfileInfo'

export const ExaminationAuth: FC<PropsWithChildren> = ({ children }) => {
  const [isUserRole, setIsUserRole] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getProfileInfo()
        const isAuth = !!user
        const userRole = user?.userType

        setIsUserRole(userRole)
        setIsAuthenticated(isAuth)
      } catch (error: any) {
        console.error(error)
        navigate('/' + Routes.auth + '/' + Routes.signIn)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isUserRole === roles.client) {
        navigate('/' + Routes.clientPages + '/' + Routes.dashboard)
      } else if (isUserRole === roles.admin) {
        navigate('/' + Routes.adminPages + '/' + Routes.dashboard)
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate('/' + Routes.auth + '/' + Routes.signIn)
    }
  }, [isLoading, isAuthenticated, isUserRole])

  return !isAuthenticated ? <>{children}</> : null
}
