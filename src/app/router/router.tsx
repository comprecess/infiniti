import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
import { CatalogPage } from '../../pages/Dashboard/CatalogPage/CatalogPage'
import { DashboardOutlet } from '../../pages/Dashboard/DashboardOutlet/DashboardOutlet'
import { DashboardPage } from '../../pages/Dashboard/DashboardPage/DashboardPage'
import { DocumentsPage } from '../../pages/Dashboard/DocumentsPage/DocumentsPage'
import { InvoicesPage } from '../../pages/Dashboard/InvoicesPage/InvoicesPage'
import { KnowledgeBasePage } from '../../pages/Dashboard/KnowledgeBasePage/KnowledgeBasePage'
import { MyOrdersPage } from '../../pages/Dashboard/MyOrdersPage/MyOrdersPage'
import { OffersPage } from '../../pages/Dashboard/OffersPage/OffersPage'
import { ProfilePage } from '../../pages/Dashboard/ProfilePage/ProfilePage'
import { ProjectsPage } from '../../pages/Dashboard/ProjectsPage/ProjectsPage'
import { TicketsPage } from '../../pages/Dashboard/TicketsPage/TicketsPage'
import { TransactionsPage } from '../../pages/Dashboard/TransactionsPage/TransactionsPage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { Routes, to } from './Routes'

export const router = createBrowserRouter([
  { path: Routes.root, element: <Navigate replace to={to.dashboard()} /> },
  {
    path: Routes.root,
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
