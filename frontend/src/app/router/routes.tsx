import { AdminAccountsPage } from '../../pages/Admin/AccountingPage/AccountsPage/AccountsPage'
import { AdminAssetsPage } from '../../pages/Admin/AccountingPage/AssetsPage/AssetsPage'
import { AdminBillsPage } from '../../pages/Admin/AccountingPage/BillsPage/BillsPage'
import { AdminNewAccountPage } from '../../pages/Admin/AccountingPage/NewAccountPage/NewAccountPage'
import { AdminNewDepositPage } from '../../pages/Admin/AccountingPage/NewDepositPage/NewDepositPage'
import { AdminNewExpensePage } from '../../pages/Admin/AccountingPage/NewExpensePage/NewExpensePage'
import { AdminTransferPage } from '../../pages/Admin/AccountingPage/TransferPage/TransferPage'
import { AdminUnclearedTransactionsPage } from '../../pages/Admin/AccountingPage/UnclearedTransactionsPage/UnclearedTransactionsPage'
import { AdminViewTransactionsPage } from '../../pages/Admin/AccountingPage/ViewTransactionsPage/ViewTransactionsPage'
import { AdminAppearancePage } from '../../pages/Admin/AppearancePage/AppearancePage'
import { AdminBusinessPlanPage } from '../../pages/Admin/BusinessPlanPage/BusinessPlanPage/BusinessPlanPage'
import { AdminMakeBusinessPlanPage } from '../../pages/Admin/BusinessPlanPage/MakeBusinessPlanPage/MakeBusinessPlanPage'
import { AdminCalendarPage } from '../../pages/Admin/CalendarPage/CalendarPage'
import { AdminAddCustomerPage } from '../../pages/Admin/CustomersPage/AddCustomerPage/AddCustomerPage'
import { AdminCompaniesPage } from '../../pages/Admin/CustomersPage/CompaniesPage/CompaniesPage'
import { AdminFilesPage } from '../../pages/Admin/CustomersPage/FilesPage/FilesPage'
import { AdminContactsListPage } from '../../pages/Admin/CustomersPage/GroupsPage/ContactsListPage/ContactsListPage'
import { AdminGroupsPage } from '../../pages/Admin/CustomersPage/GroupsPage/GroupsPage'
import { AdminReorderGroupsPage } from '../../pages/Admin/CustomersPage/GroupsPage/ReorderGroupsPage/ReorderGroupsPage'
import { AdminListCustomerPage } from '../../pages/Admin/CustomersPage/ListCustomerPage/ListCustomerPage'
import { AdminContactActivityPage } from '../../pages/Admin/CustomersPage/ViewPage/ActivityPage/ActivityPage'
import { AdminContactEditPage } from '../../pages/Admin/CustomersPage/ViewPage/EditPage/EditPage'
import { AdminContactEmailPage } from '../../pages/Admin/CustomersPage/ViewPage/EmailPage/EmailPage'
import { AdminContactFilesPage } from '../../pages/Admin/CustomersPage/ViewPage/FilesPage/FilesPage'
import { AdminContactInvoicesPage } from '../../pages/Admin/CustomersPage/ViewPage/InvoicesPage/InvoicesPage'
import { AdminContactLogPage } from '../../pages/Admin/CustomersPage/ViewPage/LogPage/LogPage'
import { AdminContactMorePage } from '../../pages/Admin/CustomersPage/ViewPage/MorePage/MorePage'
import { AdminContactOffersPage } from '../../pages/Admin/CustomersPage/ViewPage/OffersPage/OffersPage'
import { AdminContactPasswordManagerPage } from '../../pages/Admin/CustomersPage/ViewPage/PasswordManagerPage/PasswordManagerPage'
import { AdminContactSummaryPage } from '../../pages/Admin/CustomersPage/ViewPage/SummaryPage/SummaryPage'
import { AdminContactTransactionsPage } from '../../pages/Admin/CustomersPage/ViewPage/TransactionsPage/TransactionsPage'
import { AdminViewPage } from '../../pages/Admin/CustomersPage/ViewPage/ViewPage'
import { AdminDashboardPage } from '../../pages/Admin/DashboardPage/DashboardPage'
import { AdminDocumentsPage } from '../../pages/Admin/DocumentsPage/DocumentsPage'
import { AdminHRMPage } from '../../pages/Admin/HRMPage/HRMPage'
import { AdminKnowledgeBasePage } from '../../pages/Admin/KnowledgeBasePage/KnowledgeBasePage'
import { AdminLeadsPage } from '../../pages/Admin/LeadsPage/LeadsPage'
import { AdminOrdersPage } from '../../pages/Admin/OrdersPage/OrdersPage'
import { AdminPluginsPage } from '../../pages/Admin/PluginsPage/PluginsPage'
import { AdminProductsServicesPage } from '../../pages/Admin/ProductsServicesPage/ProductsServicesPage'
import { AdminProjectsPage } from '../../pages/Admin/ProjectsPage/ProjectsPage'
import { AdminPurchasePage } from '../../pages/Admin/PurchasePage/PurchasePage'
import { AdminReportsPage } from '../../pages/Admin/ReportsPage/ReportsPage'
import { AdminSalesPage } from '../../pages/Admin/SalesPage/SalesPage'
import { AdminCurrenciesPage } from '../../pages/Admin/SettingsPage/CurrenciesPage/CurrenciesPage'
import { AdminCustomContactFields } from '../../pages/Admin/SettingsPage/CustomContactFieldsPage/CustomContactFieldsPage'
import { AdminSMSPage } from '../../pages/Admin/SMSPage/SMSPage'
import { AdminSuppliersPage } from '../../pages/Admin/SuppliersPage/SuppliersPage'
import { AdminSupportPage } from '../../pages/Admin/SupportPage/SupportPage'
import { AdminTasksPage } from '../../pages/Admin/TasksPage/TasksPage'
import { AdminUtilitiesPage } from '../../pages/Admin/UtilitiesPage/UtilitiesPage'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
import { BasketPage } from '../../pages/Client/BasketPage/BasketPage'
import { ClientCatalogPage } from '../../pages/Client/CatalogPage/CatalogPage'
import { ClientDashboardPage } from '../../pages/Client/DashboardPage/DashboardPage'
import { ClientDocumentsPage } from '../../pages/Client/DocumentsPage/DocumentsPage'
import { ClientInvoicesPage } from '../../pages/Client/InvoicesPage/InvoicesPage'
import { ClientKnowledgeBasePage } from '../../pages/Client/KnowledgeBasePage/KnowledgeBasePage'
import { ClientMyOrdersPage } from '../../pages/Client/MyOrdersPage/MyOrdersPage'
import { ClientOffersPage } from '../../pages/Client/OffersPage/OffersPage'
import { ClientProfilePage } from '../../pages/Client/ProfilePage/ProfilePage'
import { ClientProjectsPage } from '../../pages/Client/ProjectsPage/ProjectsPage'
import { ClientOpenNewTicketPage } from '../../pages/Client/TicketsPage/OpenNewTicketPage/OpenNewTicketPage'
import { ClientTicketsPage } from '../../pages/Client/TicketsPage/TicketsPage/TicketsPage'
import { ClientTransactionsPage } from '../../pages/Client/TransactionsPage/TransactionsPage'
import { NotFoundPage } from '../../pages/General/NotFoundPage/NotFoundPage'

export const Routes = {
  root: '/',
  adminPages: 'admin',
  clientPages: 'client',
  dashboard: 'dashboard',
  customers: 'customers',
  view: 'view',
  summary: 'summary',
  businessPlan: 'businessplan',
  catalog: 'catalog',
  reorder: 'reorder',
  accounting: 'accounting',
  sales: 'sales',
  currencies: 'currencies',
  suppliers: 'suppliers',
  sms: 'sms',
  hrm: 'hrm',
  tasks: 'tasks',
  calendar: 'calendar',
  addCustomer: 'addcustomer',
  reports: 'reports',
  utilities: 'utilities',
  appearance: 'appearance',
  plugins: 'plugins',
  settings: 'settings',
  customFields: 'customfields',
  productsServices: 'productsservices',
  support: 'support',
  purchase: 'purchase',
  leads: 'leads',
  myOrders: 'orders',
  talent: 'talent',
  transactions: 'transactions',
  documents: 'documents',
  invoices: 'invoices',
  offers: 'offers',
  projects: 'projects',
  companies: 'companies',
  knowledgeBase: 'knowledgebase',
  tickets: 'tickets',
  groups: 'groups',
  newDeposit: 'newdeposit',
  newExpense: 'newexpense',
  transfer: 'transfer',
  bills: 'bills',
  email: 'email',
  log: 'log',
  edit: 'edit',
  more: 'more',
  passwordManager: 'passwordmanager',
  activity: 'activity',
  contactsList: 'contactslist',
  viewTransactions: 'viewtransactions',
  unclearedTransactions: 'unclearedtransactions',
  accounts: 'accounts',
  newAccount: 'newaccount',
  assets: 'assets',
  openNewTicket: 'opennewticket',
  profile: 'profile',
  basket: 'cart',
  auth: 'auth',
  makeBusinessPlan: 'makebusinessplan',
  files: 'files',
  listCustomer: 'listcustomer',
  signIn: 'signin',
  loginResident: 'loginresident',
  register: 'register',
  resetPassword: 'resetpassword',
  notFound: '404',
}

export const To = {
  dashboard: () => Routes.dashboard,
  summary: () => Routes.summary,
  signIn: () => Routes.signIn,
  notFound: () => Routes.notFound,
}

export const Pages = {
  /* Auth  pages */
  signInPage: <SignInPage />,
  loginResidentPage: <LoginResidentPage />,
  registerPage: <RegisterPage />,
  resetPasswordPage: <ResetPasswordPage />,

  /* Client Dashboard pages */
  clientDashboardPage: <ClientDashboardPage />,
  clientCatalogPage: <ClientCatalogPage />,
  clientMyOrdersPage: <ClientMyOrdersPage />,
  clientTransactionsPage: <ClientTransactionsPage />,
  clientDocumentsPage: <ClientDocumentsPage />,
  clientInvoicesPage: <ClientInvoicesPage />,
  clientOffersPage: <ClientOffersPage />,
  clientProjectsPage: <ClientProjectsPage />,
  clientKnowledgeBasePage: <ClientKnowledgeBasePage />,
  clientTicketsPage: <ClientTicketsPage />,
  clientOpenNewTicketPage: <ClientOpenNewTicketPage />,
  clientProfilePage: <ClientProfilePage />,

  /* Admin Dashboard pages */
  adminDashboardPage: <AdminDashboardPage />,
  adminAddCustomerPage: <AdminAddCustomerPage />,
  adminListCustomerPage: <AdminListCustomerPage />,
  adminCompaniesPage: <AdminCompaniesPage />,
  adminGroupsPage: <AdminGroupsPage />,
  adminFilesPage: <AdminFilesPage />,
  adminMakeBusinessPlanPage: <AdminMakeBusinessPlanPage />,
  adminBusinessPlanPage: <AdminBusinessPlanPage />,
  adminAccountsPage: <AdminAccountsPage />,
  adminAssetsPage: <AdminAssetsPage />,
  adminBillsPage: <AdminBillsPage />,
  adminContactsListPage: <AdminContactsListPage />,
  adminReorderGroupsPage: <AdminReorderGroupsPage />,
  adminNewAccountPage: <AdminNewAccountPage />,
  adminNewDepositPage: <AdminNewDepositPage />,
  adminNewExpensePage: <AdminNewExpensePage />,
  adminTransferPage: <AdminTransferPage />,
  adminUnclearedTransactionsPage: <AdminUnclearedTransactionsPage />,
  adminViewTransactionsPage: <AdminViewTransactionsPage />,
  adminSalesPage: <AdminSalesPage />,
  adminSuppliersPage: <AdminSuppliersPage />,
  adminPurchasePage: <AdminPurchasePage />,
  adminProjectsPage: <AdminProjectsPage />,
  adminLeadsPage: <AdminLeadsPage />,
  adminSMSPage: <AdminSMSPage />,
  adminSupportPage: <AdminSupportPage />,
  adminKnowledgeBasePage: <AdminKnowledgeBasePage />,
  adminOrdersPage: <AdminOrdersPage />,
  adminHRMPage: <AdminHRMPage />,
  adminDocumentsPage: <AdminDocumentsPage />,
  adminTasksPage: <AdminTasksPage />,
  adminCalendarPage: <AdminCalendarPage />,
  adminProductsServicesPage: <AdminProductsServicesPage />,
  adminReportsPage: <AdminReportsPage />,
  adminUtilitiesPage: <AdminUtilitiesPage />,
  adminAppearancePage: <AdminAppearancePage />,
  adminPluginsPage: <AdminPluginsPage />,
  adminCurrenciesPage: <AdminCurrenciesPage />,
  adminCustomContactFields: <AdminCustomContactFields />,
  adminViewPage: <AdminViewPage />,
  adminContactSummaryPage: <AdminContactSummaryPage />,
  adminContactActivityPage: <AdminContactActivityPage />,
  adminContactInvoicesPage: <AdminContactInvoicesPage />,
  adminContactOffersPage: <AdminContactOffersPage />,
  adminContactFilesPage: <AdminContactFilesPage />,
  adminContactTransactionsPage: <AdminContactTransactionsPage />,
  adminContactEmailPage: <AdminContactEmailPage />,
  adminContactLogPage: <AdminContactLogPage />,
  adminContactPasswordManagerPage: <AdminContactPasswordManagerPage />,
  adminContactEditPage: <AdminContactEditPage />,
  adminContactMorePage: <AdminContactMorePage />,

  /* General  pages */
  basketPage: <BasketPage />,
  notFoundPage: <NotFoundPage />,
}
