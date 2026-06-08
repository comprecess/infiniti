import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Pages, Routes, To } from './routes'
import { MainOutlet } from '../../features/Main/MainOutlet/MainOutlet'
import { AuthOutlet } from '../../pages/Auth/AuthOutlet/AuthOutlet'
import { RootPage } from '../../pages/General/RootPage/RootPage'
import { ExaminationAuth } from '../../shared/utils/api/Auth/ExaminationAuth'
import { ExaminationUser } from '../../shared/utils/api/Auth/ExaminationUser'
import { ChatGPTProvider } from '../../shared/utils/contexts/ChatGPTContext'
import { VersionProvider } from '../../shared/utils/contexts/VersionContext'
import { WebSocketProvider } from '../../shared/utils/providers/WebSocketProvider'

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
    path: `${Routes.public}/${Routes.auto}/${Routes.login}/:token`,
    element: Pages.publicAutoLoginPage,
  },
  {
    path: `${Routes.public}/${Routes.google}/${Routes.auth}`,
    element: Pages.publicGoogleAuthPage,
  },
  {
    path: `${Routes.public}/${Routes.google}/${Routes.auth}/:token`,
    element: Pages.publicGoogleAuthPage,
  },
  {
    path: `${Routes.public}/${Routes.invoice}/${Routes.view}/:id`,
    element: Pages.publicViewInvoice,
  },
  {
    path: `${Routes.public}/${Routes.invoice}/${Routes.proof}/${Routes.transaction}/:id`,
    element: Pages.publicInvoiceProofTransaction,
  },
  {
    path: `${Routes.public}/${Routes.offer}/${Routes.view}/:id`,
    element: Pages.publicViewOffer,
  },
  {
    path: `${Routes.public}/${Routes.view}/${Routes.businessPlan}/:id`,
    element: Pages.publicBusinessPlanViewPage,
  },
  {
    path: `${Routes.public}/${Routes.view}/${Routes.businessModel}/:id`,
    element: Pages.publicBusinessModelViewPage,
  },
  {
    path: `${Routes.public}/${Routes.getFile}/:id`,
    element: Pages.publicFilesPage,
  },
  {
    path: `${Routes.public}/test-ai`,
    element: Pages.testPageAI,
  },
  {
    path: Routes.adminPages,
    element: (
      <ExaminationUser>
        <WebSocketProvider>
          <VersionProvider>
            <ChatGPTProvider>
              <MainOutlet />
            </ChatGPTProvider>
          </VersionProvider>
        </WebSocketProvider>
      </ExaminationUser>
    ),
    children: [
      { path: Routes.dashboard, element: Pages.adminDashboardPage },
      {
        path: `${Routes.profile}/${Routes.settings}`,
        element: Pages.adminProfileSettingsPage,
      },
      {
        path: Routes.talents,
        children: [
          {
            path: Routes.catalog,
            element: Pages.adminCatalogTalentsPage,
          },
          {
            path: `${Routes.view}/${Routes.talent}/:id`,
            element: Pages.adminViewTalentPage,
          },
          {
            path: `${Routes.add}/${Routes.talent}`,
            element: Pages.adminAddTalentPage,
          },
          {
            path: `${Routes.edit}/${Routes.talent}/:id`,
            element: Pages.adminEditTalentPage,
          },
          {
            path: `${Routes.list}/${Routes.carts}`,
            element: Pages.adminListCartsPage,
          },
          {
            path: `${Routes.list}/${Routes.carts}/${Routes.cart}/:id`,
            element: Pages.adminCartPage,
          },
          {
            path: `${Routes.list}/${Routes.carts}/${Routes.cart}/:cartId/${Routes.to}/${Routes.offer}/:offerToken`,
            element: Pages.adminCartToOfferPage,
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
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
          },
        ],
      },
      {
        path: Routes.businessPlan,
        children: [
          {
            path: Routes.businessPlans,
            element: Pages.adminBusinessPlanPage,
          },
          {
            path: Routes.businessModels,
            element: Pages.adminBusinessModelsPage,
          },
          {
            path: `${Routes.edit}/${Routes.businessPlan}/:id`,
            element: Pages.adminEditBusinessPlanPage,
          },
          {
            path: `${Routes.view}/${Routes.businessPlan}/:id`,
            element: Pages.adminViewBusinessPlanPage,
          },
          {
            path: `${Routes.view}/${Routes.businessModel}/:id`,
            element: Pages.adminViewBusinessModel,
          },
          {
            path: `${Routes.edit}/${Routes.businessModel}/:id`,
            element: Pages.adminEditBusinessModel,
          },
          {
            path: `${Routes.make}/${Routes.businessPlan}`,
            element: Pages.adminMakeBusinessPlanPage,
          },
          {
            path: `${Routes.make}/${Routes.businessModel}`,
            element: Pages.adminMakeBusinessModelPage,
          },
          {
            index: true,
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
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
            path: `${Routes.assets}/${Routes.add}/${Routes.new}/${Routes.asset}`,
            element: Pages.adminNewAssetPage,
          },
          {
            path: `${Routes.assets}/${Routes.edit}/${Routes.asset}/:id`,
            element: Pages.adminEditAssetPage,
          },
          {
            path: Routes.bills,
            element: Pages.adminBillsPage,
          },
          {
            path: `${Routes.bills}/${Routes.edit}/${Routes.bill}/:id`,
            element: Pages.adminEditBillPage,
          },
          {
            path: `${Routes.new}/${Routes.account}`,
            element: Pages.adminNewAccountPage,
          },
          {
            path: `${Routes.edit}/${Routes.account}/:id`,
            element: Pages.adminEditAccountPage,
          },
          {
            path: `${Routes.new}/${Routes.deposit}`,
            element: Pages.adminNewDepositPage,
          },
          {
            path: `${Routes.new}/${Routes.expense}`,
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
            path: `${Routes.view}/${Routes.transactions}`,
            element: Pages.adminViewTransactionsPage,
          },
          {
            path: `${Routes.edit}/${Routes.transaction}/:id`,
            element: Pages.adminEditTransactionPage,
          },
          {
            index: true,
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
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
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
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
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
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
      {
        path: `${Routes.projects}/${Routes.view}/${Routes.project}/:id`,
        element: Pages.adminViewProjectPage,
        children: [
          {
            path: Routes.summary,
            element: Pages.adminProjectsSummaryPage,
          },
          {
            path: Routes.tasks,
            element: Pages.adminProjectsTasksPage,
          },
          {
            path: Routes.files,
            element: Pages.adminProjectsFilesPage,
          },
          {
            path: Routes.expenses,
            element: Pages.adminProjectsExpensesPage,
          },
          {
            path: Routes.invoices,
            element: Pages.adminProjectsInvoicesPage,
          },
          {
            path: Routes.ganttChart,
            element: Pages.adminProjectsGanttChartPage,
          },
          {
            path: Routes.logs,
            element: Pages.adminProjectsLogsPage,
          },
          {
            path: 'onboarding',
            element: Pages.adminProjectsOnboardingPage,
          },
          {
            path: 'deal-room',
            element: Pages.adminProjectsDealRoomPage,
          },
          {
            path: 'valuation',
            element: Pages.adminProjectsValuationPage,
          },
          {
            path: 'growth-plan',
            element: Pages.adminProjectsGrowthPlanPage,
          },
          {
            path: "analytics",
            element: Pages.adminProjectsAnalyticsPage,
          },
          {
            path: "pipeline-buyers",
            element: Pages.adminProjectsComingSoonPage,
          },
          {
            path: "pipeline-investors",
            element: Pages.adminProjectsComingSoonPage,
          },
          {
            path: "*",
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
        path: Routes.leads,
        children: [
          { path: '', element: Pages.adminLeadsPage },
          { path: `${Routes.leadsWebToLead}`, element: Pages.adminWebToLeadPage },
        ],
      },
      { path: Routes.sms, element: Pages.adminSMSPage },
      {
        path: Routes.support,
        children: [
          {
            path: `${Routes.new}/${Routes.ticket}`,
            element: Pages.adminNewTicketPage,
          },
          {
            path: `${Routes.tickets}/${Routes.list}`,
            element: Pages.adminTicketsListPage,
          },
          {
            path: `${Routes.tickets}/${Routes.view}/${Routes.ticket}/:id`,
            element: Pages.adminViewTicketPage,
          },
          {
            path: Routes.predefinedReplies,
            element: Pages.adminPredefinedRepliesPage,
          },
          {
            path: Routes.supportDepartments,
            element: Pages.adminDepartmentsPage,
          },
          {
            index: true,
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
          },
        ],
      },
      {
        path: Routes.knowledgeBase,
        children: [
          { path: '', element: Pages.adminKnowledgeBasePage },
          { path: 'popular-questions', element: Pages.adminKbPopularQuestionsPage },
        ],
      },
      { path: Routes.myOrders, element: Pages.adminOrdersPage },
      { path: Routes.hrm, element: Pages.adminHRMPage },
      { path: Routes.documents, element: Pages.adminDocumentsPage },
      { path: Routes.tasks, element: Pages.adminTasksPage },
      { path: Routes.calendar, element: Pages.adminCalendarPage },
      { path: Routes.reports, element: Pages.adminReportsPage },
      {
        path: Routes.utilities,
        children: [
          { path: Routes.activityLog, element: Pages.adminActivityLogPage },
          { path: Routes.emailMessageLog, element: Pages.adminEmailMessageLogPage },
          { path: Routes.invoiceAccessLog, element: Pages.adminInvoiceAccessLogPage },
          { path: Routes.backup, element: Pages.adminBackupPage },
          { path: Routes.databaseStatus, element: Pages.adminDatabaseStatusPage },
          { path: Routes.cronLog, element: Pages.adminCronLogPage },
          { path: Routes.integrationCode, element: Pages.adminIntegrationCodePage },
          { path: Routes.systemStatus, element: Pages.adminSystemStatusPage },
          { path: Routes.passwordManager, element: Pages.adminPasswordManagerPage },
          { path: Routes.tools, element: Pages.adminToolsPage },
        ],
      },
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
            path: Routes.localization,
            element: Pages.adminLocalizationPage,
          },
          {
            path: Routes.generalSettings,
            element: Pages.adminGeneralSettingsPage,
          },
          {
            path: Routes.emailTemplates,
            element: Pages.adminEmailTemplatesPage,
          },
          {
            index: true,
            element: <Navigate replace to={`/${Routes.adminPages}/${Routes.dashboard}`} />,
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
        <WebSocketProvider>
          <VersionProvider>
            <MainOutlet />
          </VersionProvider>
        </WebSocketProvider>
      </ExaminationUser>
    ),
    children: [
      { path: Routes.dashboard, element: Pages.clientDashboardPage },
      {
        path: `${Routes.settings}/${Routes.profile}`,
        element: Pages.clientProfileSettingsPage,
      },
      { path: Routes.talents, element: Pages.clientTalentsPage },
      {
        path: `${Routes.talents}/${Routes.talent}/:id`,
        element: Pages.clientTalentDetailsPage,
      },
      {
        path: `${Routes.businessPlan}/${Routes.businessPlans}`,
        element: Pages.clientBusinessPlansPage,
      },
      {
        path: `${Routes.businessPlan}/${Routes.businessModels}`,
        element: Pages.clientBusinessModelsPage,
      },
      {
        path: `${Routes.businessPlans}/${Routes.businessPlan}/${Routes.view}/:id`,
        element: Pages.clientViewBusinessPlanPage,
      },
      {
        path: `${Routes.businessModels}/${Routes.businessModel}/${Routes.view}/:id`,
        element: Pages.clientViewBusinessModelsPage,
      },

      { path: Routes.myOrders, element: Pages.clientMyOrdersPage },
      { path: Routes.transactions, element: Pages.clientTransactionsPage },
      { path: Routes.documents, element: Pages.clientDocumentsPage },
      { path: Routes.invoices, element: Pages.clientInvoicesPage },
      { path: Routes.offers, element: Pages.clientOffersPage },
      { path: Routes.projects, element: Pages.clientProjectsPage },
      {
        path: `${Routes.projects}/${Routes.edit}/${Routes.project}/:id`,
        element: Pages.clientEditProjectPage,
      },
      {
        path: `${Routes.projects}/${Routes.view}/${Routes.project}/:id`,
        element: Pages.clientViewProjectPage,
        children: [
          {
            path: Routes.summary,
            element: Pages.clientProjectsSummaryPage,
          },
          {
            path: Routes.tasks,
            element: Pages.clientProjectsTasksPage,
          },
          {
            path: Routes.files,
            element: Pages.clientProjectsFilesPage,
          },
          {
            path: Routes.expenses,
            element: Pages.clientProjectsExpensesPage,
          },
          {
            path: Routes.invoices,
            element: Pages.clientProjectsInvoicesPage,
          },
          {
            path: Routes.ganttChart,
            element: Pages.clientGanttChartPage,
          },
          {
            path: 'onboarding',
            element: Pages.adminProjectsOnboardingPage,
          },
          {
            path: 'deal-room',
            element: Pages.adminProjectsDealRoomPage,
          },
          {
            path: 'valuation',
            element: Pages.adminProjectsValuationPage,
          },
          {
            path: 'growth-plan',
            element: Pages.adminProjectsGrowthPlanPage,
          },
          {
            path: "analytics",
            element: Pages.adminProjectsAnalyticsPage,
          },
          {
            path: 'pipeline-buyers',
            element: Pages.adminProjectsComingSoonPage,
          },
          {
            path: 'pipeline-investors',
            element: Pages.adminProjectsComingSoonPage,
          },
          {
            path: Routes.logs,
            element: Pages.adminProjectsLogsPage,
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
        path: Routes.knowledgeBase,
        element: Pages.clientKnowledgeBasePage,
      },
      {
        path: Routes.tickets,
        children: [
          {
            path: `${Routes.new}/${Routes.ticket}`,
            element: Pages.clientOpenNewTicketPage,
          },
          { path: '', element: Pages.clientTicketsPage },
          { path: `${Routes.view}/${Routes.ticket}/:id`, element: Pages.clientViewTicketPage },
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
        path: `/${Routes.auth}/${Routes.reset}/${Routes.resident}/${Routes.password}`,
        element: Pages.resetPasswordPage,
      },
      {
        path: `/${Routes.auth}/${Routes.reset}/${Routes.clientPages}/${Routes.password}`,
        element: Pages.resetPasswordPage,
      },
      {
        path: '*',
        index: true,
        element: <Navigate replace to={`/${Routes.auth}/${Routes.sign}/${Routes.in}`} />,
      },
    ],
  },
  { path: Routes.serverError, element: Pages.serverErrorPage },
  { path: Routes.forbidden, element: Pages.forbiddenPage },
  { path: Routes.notFound, element: Pages.notFoundPage },

  { path: '*', element: <Navigate replace to={To.notFound()} /> },
])
