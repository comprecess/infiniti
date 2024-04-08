import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthPage } from '../../pages/Auth/AuthPage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { RootPage } from '../../pages/Root/RootPage'
import { Routes, to } from './Routes'

export const router = createBrowserRouter([
  { path: Routes.root, element: <RootPage /> },
  { path: Routes.auth, element: <AuthPage /> },
  { path: Routes.notFound, element: <NotFoundPage /> },

  { path: '*', element: <Navigate replace to={to.notFound()} /> },
])
