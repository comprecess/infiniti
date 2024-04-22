import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { DashboardOutlet } from '../../pages/Main/DashboardOutlet/DashboardOutlet'
import { Pages, Routes, To } from './routes'

export const router = createBrowserRouter([
  {
    path: Routes.userPages,
    element: <Navigate replace to={To.dashboard()} />,
  },
  {
    path: Routes.adminPages,
    element: <DashboardOutlet />,
    children: [
      { path: Routes.dashboard, element: Pages.adminDashboardPage },
      { path: Routes.catalog, element: Pages.adminCatalogPage },
      { path: Routes.myOrders, element: Pages.adminMyOrdersPage },
      { path: Routes.transactions, element: Pages.adminTransactionsPage },
      { path: Routes.documents, element: Pages.adminDocumentsPage },
      { path: Routes.invoices, element: Pages.adminInvoicesPage },
      { path: Routes.offers, element: Pages.adminOffersPage },
      { path: Routes.projects, element: Pages.adminProjectsPage },
      {
        path: Routes.knowledgeBase,
        element: Pages.adminKnowledgeBasePage,
      },
      { path: Routes.tickets, element: Pages.adminTicketsPage },
      { path: Routes.profile, element: Pages.adminProfilePage },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={To.dashboard()} />,
      },
    ],
  },
  {
    path: Routes.userPages,
    element: <DashboardOutlet />,
    children: [
      { path: Routes.dashboard, element: Pages.userDashboardPage },
      { path: Routes.customers, element: Pages.userCustomersPage },
      { path: Routes.businessPlan, element: Pages.userBusinessPlanPage },
      { path: Routes.accounting, element: Pages.userAccountingPage },
      { path: Routes.sales, element: Pages.userSalesPage },
      { path: Routes.suppliers, element: Pages.userSuppliersPage },
      { path: Routes.purchase, element: Pages.userPurchasePage },
      { path: Routes.projects, element: Pages.userProjectsPage },
      { path: Routes.leads, element: Pages.userLeadsPage },
      { path: Routes.sms, element: Pages.userSMSPage },
      { path: Routes.support, element: Pages.userSupportPage },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={To.dashboard()} />,
      },
    ],
  },
  {
    path: Routes.auth,
    element: <AuthOutlet />,
    children: [
      { path: Routes.signIn, element: Pages.signInPage },
      { path: Routes.loginResident, element: Pages.loginResidentPage },
      { path: Routes.register, element: Pages.registerPage },
      { path: Routes.resetPassword, element: Pages.resetPasswordPage },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={To.signIn()} />,
      },
    ],
  },
  { path: Routes.notFound, element: Pages.notFoundPage },

  { path: '*', element: <Navigate replace to={To.notFound()} /> },
])
