import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
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
      { path: Routes.signIn, element: <SignInPage /> },
      { path: Routes.loginResident, element: <LoginResidentPage /> },
      { path: Routes.register, element: <RegisterPage /> },
      { path: Routes.resetPassword, element: <ResetPasswordPage /> },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={to.signIn()} />,
      },
    ],
  },

  { path: '*', element: <Navigate replace to={to.notFound()} /> },
])
