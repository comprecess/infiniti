import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainOutlet } from '../../features/Main/MainOutlet/MainOutlet'
import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { RootPage } from '../../pages/General/RootPage/RootPage'
import { ExaminationAuth } from '../../shared/utils/api/Auth/ExaminationAuth'
import { ExaminationUser } from '../../shared/utils/api/Auth/ExaminationUser'
import { Pages, Routes, To } from './routes'

export const router = createBrowserRouter([
  {
    path: Routes.root,
    element: (
      <ExaminationAuth>
        <RootPage />
      </ExaminationAuth>
    ),
  },
  {
    path: `${Routes.public}/${Routes.invoice}/${Routes.view}/:id`,
    element: Pages.publicViewInvoice,
  },
  {
    path: `${Routes.public}/${Routes.offer}/${Routes.view}/:id`,
    element: Pages.publicViewOffer,
  },
  {
    path: Routes.adminPages,
    element: (
      <ExaminationUser>
        <MainOutlet />
      </ExaminationUser>
    ),
    children: [
      { path: Routes.dashboard, element: Pages.adminDashboardPage },
      {
        path: Routes.talents,
        children: [
          {
            path: `${Routes.list}/${Routes.talent}`,
            element: Pages.adminListTalentsPage,
          },
          {
            path: `${Routes.add}/${Routes.talent}`,
            element: Pages.adminAddTalentPage,
          },
          {
            path: `${Routes.edit}/${Routes.talent}/:id`,
            element: Pages.adminEditTalentPage,
          },
        ],
      },
      {
        path: Routes.customers,
        children: [
          {
            path: `${Routes.view}/:id`,
            element: Pages.adminViewPage,
            children: [
              {
                path: Routes.summary,
                element: Pages.adminContactSummaryPage,
              },
              {
                path: Routes.activity,
                element: Pages.adminContactActivityPage,
              },
              {
                path: Routes.invoices,
                element: Pages.adminContactInvoicesPage,
              },
              {
                path: Routes.offers,
                element: Pages.adminContactOffersPage,
              },
              {
                path: Routes.files,
                element: Pages.adminContactFilesPage,
              },
              {
                path: Routes.transactions,
                element: Pages.adminContactTransactionsPage,
              },
              {
                path: Routes.email,
                element: Pages.adminContactEmailPage,
              },
              {
                path: Routes.log,
                element: Pages.adminContactLogPage,
              },
              {
                path: Routes.passwordManager,
                element: Pages.adminContactPasswordManagerPage,
              },
              {
                path: Routes.edit,
                element: Pages.adminContactEditPage,
              },
              {
                path: Routes.more,
                element: Pages.adminContactMorePage,
              },
              {
                path: '*',
                index: true,
                element: <Navigate replace to={To.summary()} />,
              },
              {
                index: true,
                element: <Navigate replace to={To.summary()} />,
              },
            ],
          },
          {
            path: `${Routes.add}/${Routes.customer}`,
            element: Pages.adminAddCustomerPage,
          },
          {
            path: `${Routes.list}/${Routes.customer}`,
            element: Pages.adminListCustomerPage,
          },
          {
            path: Routes.companies,
            element: Pages.adminCompaniesPage,
          },
          {
            path: Routes.groups,
            element: Pages.adminGroupsPage,
          },
          {
            path: `${Routes.groups}/${Routes.contacts}/${Routes.list}/:id`,
            element: Pages.adminContactsListPage,
          },
          {
            path: `${Routes.groups}/${Routes.reorder}`,
            element: Pages.adminReorderGroupsPage,
          },
          {
            path: Routes.files,
            element: Pages.adminFilesPage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
      {
        path: Routes.businessPlan,
        children: [
          {
            path: Routes.makeBusinessPlan,
            element: Pages.adminMakeBusinessPlanPage,
          },
          {
            path: Routes.businessPlan,
            element: Pages.adminBusinessPlanPage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
      {
        path: Routes.accounting,
        children: [
          {
            path: Routes.accounts,
            element: Pages.adminAccountsPage,
          },
          {
            path: Routes.assets,
            element: Pages.adminAssetsPage,
          },
          {
            path: Routes.bills,
            element: Pages.adminBillsPage,
          },
          {
            path: Routes.newAccount,
            element: Pages.adminNewAccountPage,
          },
          {
            path: Routes.newDeposit,
            element: Pages.adminNewDepositPage,
          },
          {
            path: Routes.newExpense,
            element: Pages.adminNewExpensePage,
          },
          {
            path: Routes.transfer,
            element: Pages.adminTransferPage,
          },
          {
            path: Routes.unclearedTransactions,
            element: Pages.adminUnclearedTransactionsPage,
          },
          {
            path: Routes.viewTransactions,
            element: Pages.adminViewTransactionsPage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
      {
        path: Routes.sales,
        children: [
          {
            path: Routes.invoices,
            element: Pages.adminInvoicesPage,
          },
          {
            path: `${Routes.new}/${Routes.invoice}`,
            element: Pages.adminNewInvoicePage,
          },
          {
            path: `${Routes.edit}/${Routes.invoice}/:id`,
            element: Pages.adminEditInvoicePage,
          },
          {
            path: `${Routes.invoice}/${Routes.view}/:id`,
            element: Pages.adminViewInvoicePage,
          },
          {
            path: Routes.offers,
            element: Pages.adminOffersPage,
          },
          {
            path: `${Routes.new}/${Routes.offer}`,
            element: Pages.adminNewOfferPage,
          },
          {
            path: `${Routes.edit}/${Routes.offer}/:id`,
            element: Pages.adminEditOfferPage,
          },
          {
            path: `${Routes.offer}/${Routes.view}/:id`,
            element: Pages.adminViewOfferPage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
      {
        path: Routes.suppliers,
        children: [
          {
            path: `${Routes.add}/${Routes.supplier}`,
            element: Pages.adminAddSupplierPage,
          },
          {
            path: `${Routes.list}/${Routes.suppliers}`,
            element: Pages.adminListSuppliersPage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
      { path: Routes.purchase, element: Pages.adminPurchasePage },
      { path: Routes.projects, element: Pages.adminProjectsPage },
      {
        path: `${Routes.projects}/${Routes.new}/${Routes.project}`,
        element: Pages.adminCreateNewProject,
      },
      {
        path: `${Routes.projects}/${Routes.edit}/${Routes.project}/:id`,
        element: Pages.adminEditProject,
      },
      { path: Routes.leads, element: Pages.adminLeadsPage },
      { path: Routes.sms, element: Pages.adminSMSPage },
      { path: Routes.support, element: Pages.adminSupportPage },
      {
        path: Routes.knowledgeBase,
        element: Pages.adminKnowledgeBasePage,
      },
      { path: Routes.myOrders, element: Pages.adminOrdersPage },
      { path: Routes.hrm, element: Pages.adminHRMPage },
      { path: Routes.documents, element: Pages.adminDocumentsPage },
      { path: Routes.tasks, element: Pages.adminTasksPage },
      { path: Routes.calendar, element: Pages.adminCalendarPage },
      { path: Routes.reports, element: Pages.adminReportsPage },
      { path: Routes.utilities, element: Pages.adminUtilitiesPage },
      { path: Routes.appearance, element: Pages.adminAppearancePage },
      { path: Routes.plugins, element: Pages.adminPluginsPage },
      {
        path: Routes.settings,
        children: [
          { path: Routes.users, element: Pages.adminUsersPage },
          {
            path: `${Routes.users}/${Routes.edit}/${Routes.user}/:id`,
            element: Pages.adminEditUserPage,
          },
          {
            path: `${Routes.users}/${Routes.new}/${Routes.user}`,
            element: Pages.adminNewUserPage,
          },
          { path: Routes.currencies, element: Pages.adminCurrenciesPage },
          {
            path: `${Routes.custom}/${Routes.contact}/${Routes.fields}`,
            element: Pages.adminCustomContactFields,
          },
          { path: Routes.roles, element: Pages.adminRolesPage },
          {
            path: `${Routes.roles}/${Routes.new}/${Routes.role}`,
            element: Pages.adminNewRolePage,
          },
          {
            path: `${Routes.roles}/${Routes.edit}/${Routes.role}/:id`,
            element: Pages.adminEditRolePage,
          },
          {
            index: true,
            element: (
              <Navigate
                replace
                to={`/${Routes.adminPages}/${Routes.dashboard}`}
              />
            ),
          },
        ],
      },
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
    element: (
      <ExaminationUser>
        <MainOutlet />
      </ExaminationUser>
    ),
    children: [
      { path: Routes.dashboard, element: Pages.clientDashboardPage },
      { path: Routes.talents, element: Pages.clientTalentsPage },
      {
        path: `${Routes.talents}/${Routes.talent}/:id`,
        element: Pages.clientTalentDetailsPage,
      },
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
      {
        path: Routes.tickets,
        children: [
          {
            path: Routes.openNewTicket,
            element: Pages.clientOpenNewTicketPage,
          },
          { path: Routes.tickets, element: Pages.clientTicketsPage },
        ],
      },
      { path: Routes.profile, element: Pages.clientProfilePage },
      { path: Routes.basket, element: Pages.clientBasketPage },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={To.dashboard()} />,
      },
    ],
  },
  {
    path: Routes.auth,
    element: (
      <ExaminationAuth>
        <AuthOutlet />
      </ExaminationAuth>
    ),
    children: [
      {
        path: `${Routes.sign}/${Routes.in}`,
        element: Pages.signInPage,
      },
      {
        path: `${Routes.login}/${Routes.resident}`,
        element: Pages.loginResidentPage,
      },
      { path: Routes.register, element: Pages.registerPage },
      {
        path: `${Routes.reset}/${Routes.password}`,
        element: Pages.resetPasswordPage,
      },
      {
        path: '*',
        index: true,
        element: (
          <Navigate
            replace
            to={`/${Routes.auth}/${Routes.sign}/${Routes.in}`}
          />
        ),
      },
    ],
  },
  { path: Routes.notFound, element: Pages.notFoundPage },

  { path: '*', element: <Navigate replace to={To.notFound()} /> },
])
