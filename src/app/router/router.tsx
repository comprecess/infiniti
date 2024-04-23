import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { DashboardOutlet } from '../../pages/Main/DashboardOutlet/DashboardOutlet'
import { Pages, Routes, To } from './routes'

export const router = createBrowserRouter([
  {
    path: Routes.root,
    element: <Navigate replace to={To.clientDashboard()} />,
  },
  {
    path: Routes.adminPages,
    element: <DashboardOutlet />,
    children: [
      { path: Routes.dashboard, element: Pages.adminDashboardPage },
      { path: Routes.customers, element: Pages.adminCustomersPage },
      { path: Routes.businessPlan, element: Pages.adminBusinessPlanPage },
      { path: Routes.accounting, element: Pages.adminAccountingPage },
      { path: Routes.sales, element: Pages.adminSalesPage },
      { path: Routes.suppliers, element: Pages.adminSuppliersPage },
      { path: Routes.purchase, element: Pages.adminPurchasePage },
      { path: Routes.projects, element: Pages.adminProjectsPage },
      { path: Routes.leads, element: Pages.adminLeadsPage },
      { path: Routes.sms, element: Pages.adminSMSPage },
      { path: Routes.support, element: Pages.adminSupportPage },
      { path: Routes.knowledgeBase, element: Pages.adminKnowledgeBasePage },
      { path: Routes.myOrders, element: Pages.adminOrdersPage },
      { path: Routes.hrm, element: Pages.adminHRMPage },
      { path: Routes.documents, element: Pages.adminDocumentsPage },
      { path: Routes.tasks, element: Pages.adminTasksPage },
      { path: Routes.calendar, element: Pages.adminCalendarPage },
      { path: Routes.reports, element: Pages.adminReportsPage },
      { path: Routes.utilities, element: Pages.adminUtilitiesPage },
      { path: Routes.appearance, element: Pages.adminAppearancePage },
      { path: Routes.plugins, element: Pages.adminPluginsPage },
      { path: Routes.settings, element: Pages.adminSettingsPage },
      {
        path: Routes.productsServices,
        element: Pages.adminProductsServicesPage,
      },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={To.dashboard()} />,
      },
    ],
  },
  {
    path: Routes.clientPages,
    element: <DashboardOutlet />,
    children: [
      { path: Routes.dashboard, element: Pages.clientDashboardPage },
      { path: Routes.catalog, element: Pages.clientCatalogPage },
      { path: Routes.myOrders, element: Pages.clientMyOrdersPage },
      { path: Routes.transactions, element: Pages.clientTransactionsPage },
      { path: Routes.documents, element: Pages.clientDocumentsPage },
      { path: Routes.invoices, element: Pages.clientInvoicesPage },
      { path: Routes.offers, element: Pages.clientOffersPage },
      { path: Routes.projects, element: Pages.clientProjectsPage },
      {
        path: Routes.knowledgeBase,
        element: Pages.clientKnowledgeBasePage,
      },
      { path: Routes.tickets, element: Pages.clientTicketsPage },
      { path: Routes.profile, element: Pages.clientProfilePage },
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
