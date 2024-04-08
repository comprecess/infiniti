import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { LoginPage } from '../../pages/Auth/LoginPage/LoginPage'
import { PasswordResetPage } from '../../pages/Auth/PasswordResetPage/PasswordResetPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { RootPage } from '../../pages/Root/RootPage'
import { Routes, to } from './Routes'

export const router = createBrowserRouter([
  { path: Routes.root, element: <RootPage /> },
  { path: Routes.notFound, element: <NotFoundPage /> },

  {
    path: Routes.auth,
    element: <AuthOutlet />,
    children: [
      { path: Routes.login, element: <LoginPage /> },
      { path: Routes.register, element: <RegisterPage /> },
      { path: Routes.passwordReset, element: <PasswordResetPage /> },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={to.login()} />,
      },
    ],
  },

  { path: '*', element: <Navigate replace to={to.notFound()} /> },
])
