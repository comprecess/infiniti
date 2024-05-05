import { AdminAccountingPage } from '../../pages/Admin/AccountingPage/AccountingPage'
import { AdminAppearancePage } from '../../pages/Admin/AppearancePage/AppearancePage'
import { AdminBusinessPlanPage } from '../../pages/Admin/BusinessPlanPage/BusinessPlanPage'
import { AdminCalendarPage } from '../../pages/Admin/CalendarPage/CalendarPage'
import { AdminCustomersPage } from '../../pages/Admin/CustomersPage/CustomersPage'
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
import { AdminSettingsPage } from '../../pages/Admin/SettingsPage/SettingsPage'
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
import { ClientTicketsPage } from '../../pages/Client/TicketsPage/TicketsPage'
import { ClientTransactionsPage } from '../../pages/Client/TransactionsPage/TransactionsPage'
import { NotFoundPage } from '../../pages/General/NotFoundPage/NotFoundPage'

export const Routes = {
  root: '/',
  adminPages: 'admin',
  clientPages: 'client',
  dashboard: 'dashboard',
  customers: 'customers',
  businessPlan: 'businessplan',
  catalog: 'catalog',
  accounting: 'accounting',
  sales: 'sales',
  suppliers: 'suppliers',
  sms: 'sms',
  hrm: 'hrm',
  tasks: 'tasks',
  calendar: 'calendar',
  reports: 'reports',
  utilities: 'utilities',
  appearance: 'appearance',
  plugins: 'plugins',
  settings: 'settings',
  productsServices: 'productsservices',
  support: 'support',
  purchase: 'purchase',
  leads: 'leads',
  myOrders: 'orders',
  transactions: 'transactions',
  documents: 'documents',
  invoices: 'invoices',
  offers: 'offers',
  projects: 'projects',
  knowledgeBase: 'knowledgebase',
  tickets: 'tickets',
  profile: 'profile',
  basket: 'basket',
  auth: 'auth',
  signIn: 'signin',
  loginResident: 'loginresident',
  register: 'register',
  resetPassword: 'resetpassword',
  notFound: 'notFound',
}

export const To = {
  authSignIn: () => Routes.auth + '/' + Routes.signIn,
  dashboard: () => Routes.dashboard,
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
  clientProfilePage: <ClientProfilePage />,

  /* Admin Dashboard pages */
  adminDashboardPage: <AdminDashboardPage />,
  adminCustomersPage: <AdminCustomersPage />,
  adminBusinessPlanPage: <AdminBusinessPlanPage />,
  adminAccountingPage: <AdminAccountingPage />,
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
  adminSettingsPage: <AdminSettingsPage />,

  /* General  pages */
  basketPage: <BasketPage />,
  notFoundPage: <NotFoundPage />,
}
