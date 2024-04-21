import { createBrowserRouter, Navigate } from 'react-router-dom'

import { CatalogPage } from '../../pages/Admin/CatalogPage/CatalogPage'
import { DashboardPage } from '../../pages/Admin/DashboardPage/DashboardPage'
import { DocumentsPage } from '../../pages/Admin/DocumentsPage/DocumentsPage'
import { InvoicesPage } from '../../pages/Admin/InvoicesPage/InvoicesPage'
import { KnowledgeBasePage } from '../../pages/Admin/KnowledgeBasePage/KnowledgeBasePage'
import { MyOrdersPage } from '../../pages/Admin/MyOrdersPage/MyOrdersPage'
import { OffersPage } from '../../pages/Admin/OffersPage/OffersPage'
import { ProfilePage } from '../../pages/Admin/ProfilePage/ProfilePage'
import { ProjectsPage } from '../../pages/Admin/ProjectsPage/ProjectsPage'
import { TicketsPage } from '../../pages/Admin/TicketsPage/TicketsPage'
import { TransactionsPage } from '../../pages/Admin/TransactionsPage/TransactionsPage'
import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
import { DashboardOutlet } from '../../pages/Dashboard/DashboardOutlet/DashboardOutlet'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { Routes, to } from './Routes'

export const router = createBrowserRouter([
  { path: Routes.root, element: <Navigate replace to={to.dashboard()} /> },
  {
    path: Routes.admin,
    element: <DashboardOutlet />,
    children: [
      { path: Routes.dashboard, element: <DashboardPage /> },
      { path: Routes.catalog, element: <CatalogPage /> },
      { path: Routes.myOrders, element: <MyOrdersPage /> },
      { path: Routes.transactions, element: <TransactionsPage /> },
      { path: Routes.documents, element: <DocumentsPage /> },
      { path: Routes.invoices, element: <InvoicesPage /> },
      { path: Routes.offers, element: <OffersPage /> },
      { path: Routes.projects, element: <ProjectsPage /> },
      { path: Routes.knowledgeBase, element: <KnowledgeBasePage /> },
      { path: Routes.tickets, element: <TicketsPage /> },
      { path: Routes.profile, element: <ProfilePage /> },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={to.dashboard()} />,
      },
    ],
  },
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
  { path: Routes.notFound, element: <NotFoundPage /> },

  { path: '*', element: <Navigate replace to={to.notFound()} /> },
])
