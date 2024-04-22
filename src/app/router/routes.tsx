import { AdminCatalogPage } from '../../pages/Admin/CatalogPage/CatalogPage'
import { AdminDashboardPage } from '../../pages/Admin/DashboardPage/DashboardPage'
import { AdminDocumentsPage } from '../../pages/Admin/DocumentsPage/DocumentsPage'
import { AdminInvoicesPage } from '../../pages/Admin/InvoicesPage/InvoicesPage'
import { AdminKnowledgeBasePage } from '../../pages/Admin/KnowledgeBasePage/KnowledgeBasePage'
import { AdminMyOrdersPage } from '../../pages/Admin/MyOrdersPage/MyOrdersPage'
import { AdminOffersPage } from '../../pages/Admin/OffersPage/OffersPage'
import { AdminProfilePage } from '../../pages/Admin/ProfilePage/ProfilePage'
import { AdminProjectsPage } from '../../pages/Admin/ProjectsPage/ProjectsPage'
import { AdminTicketsPage } from '../../pages/Admin/TicketsPage/TicketsPage'
import { AdminTransactionsPage } from '../../pages/Admin/TransactionsPage/TransactionsPage'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { UserAccountingPage } from '../../pages/User/AccountingPage/AccountingPage'
import { UserBusinessPlanPage } from '../../pages/User/BusinessPlanPage/BusinessPlanPage'
import { UserCustomersPage } from '../../pages/User/CustomersPage/CustomersPage'
import { UserDashboardPage } from '../../pages/User/DashboardPage/DashboardPage'
import { UserLeadsPage } from '../../pages/User/LeadsPage/LeadsPage'
import { UserProjectsPage } from '../../pages/User/ProjectsPage/ProjectsPage'
import { UserPurchasePage } from '../../pages/User/PurchasePage/PurchasePage'
import { UserSalesPage } from '../../pages/User/SalesPage/SalesPage'
import { UserSMSPage } from '../../pages/User/SMSPage/SMSPage'
import { UserSuppliersPage } from '../../pages/User/SuppliersPage/SuppliersPage'
import { UserSupportPage } from '../../pages/User/SupportPage/SupportPage'

export const Routes = {
  userPages: '/',
  adminPages: 'admin',
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
  auth: 'auth',
  signIn: 'signin',
  loginResident: 'loginresident',
  register: 'register',
  resetPassword: 'resetpassword',
  notFound: 'notFound',
}

export const To = {
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

  /* Admin Dashboard pages */
  adminDashboardPage: <AdminDashboardPage />,
  adminCatalogPage: <AdminCatalogPage />,
  adminMyOrdersPage: <AdminMyOrdersPage />,
  adminTransactionsPage: <AdminTransactionsPage />,
  adminDocumentsPage: <AdminDocumentsPage />,
  adminInvoicesPage: <AdminInvoicesPage />,
  adminOffersPage: <AdminOffersPage />,
  adminProjectsPage: <AdminProjectsPage />,
  adminKnowledgeBasePage: <AdminKnowledgeBasePage />,
  adminTicketsPage: <AdminTicketsPage />,
  adminProfilePage: <AdminProfilePage />,

  /* User Dashboard pages */
  userDashboardPage: <UserDashboardPage />,
  userCustomersPage: <UserCustomersPage />,
  userBusinessPlanPage: <UserBusinessPlanPage />,
  userAccountingPage: <UserAccountingPage />,
  userSalesPage: <UserSalesPage />,
  userSuppliersPage: <UserSuppliersPage />,
  userPurchasePage: <UserPurchasePage />,
  userProjectsPage: <UserProjectsPage />,
  userLeadsPage: <UserLeadsPage />,
  userSMSPage: <UserSMSPage />,
  userSupportPage: <UserSupportPage />,

  /* Other  pages */
  notFoundPage: <NotFoundPage />,
}
