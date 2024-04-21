import { AdminCatalogPage } from '../../pages/Admin/AdminCatalogPage/AdminCatalogPage'
import { AdminDashboardPage } from '../../pages/Admin/AdminDashboardPage/AdminDashboardPage'
import { AdminDocumentsPage } from '../../pages/Admin/AdminDocumentsPage/AdminDocumentsPage'
import { AdminInvoicesPage } from '../../pages/Admin/AdminInvoicesPage/AdminInvoicesPage'
import { AdminKnowledgeBasePage } from '../../pages/Admin/AdminKnowledgeBasePage/AdminKnowledgeBasePage'
import { AdminMyOrdersPage } from '../../pages/Admin/AdminMyOrdersPage/AdminMyOrdersPage'
import { AdminOffersPage } from '../../pages/Admin/AdminOffersPage/AdminOffersPage'
import { AdminProfilePage } from '../../pages/Admin/AdminProfilePage/AdminProfilePage'
import { AdminProjectsPage } from '../../pages/Admin/AdminProjectsPage/AdminProjectsPage'
import { AdminTicketsPage } from '../../pages/Admin/AdminTicketsPage/AdminTicketsPage'
import { AdminTransactionsPage } from '../../pages/Admin/AdminTransactionsPage/AdminTransactionsPage'
import { LoginResidentPage } from '../../pages/Auth/LoginResidentPage/LoginResidentPage'
import { RegisterPage } from '../../pages/Auth/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage/ResetPasswordPage'
import { SignInPage } from '../../pages/Auth/SignInPage/SignInPage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'

export const Routes = {
  root: '/',
  adminPages: 'admin',
  dashboard: 'dashboard',
  catalog: 'catalog',
  myOrders: 'myorders',
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
  root: () => Routes.root,
  adminPages: () => Routes.adminPages,
  dashboard: () => Routes.dashboard,
  catalog: () => Routes.catalog,
  myOrders: () => Routes.myOrders,
  transactions: () => Routes.transactions,
  documents: () => Routes.documents,
  invoices: () => Routes.invoices,
  offers: () => Routes.offers,
  projects: () => Routes.projects,
  knowledgeBase: () => Routes.knowledgeBase,
  tickets: () => Routes.tickets,
  profile: () => Routes.profile,
  auth: () => Routes.auth,
  signIn: () => Routes.signIn,
  loginResident: () => Routes.loginResident,
  register: () => Routes.register,
  resetPassword: () => Routes.resetPassword,
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

  /* Other  pages */
  notFoundPage: <NotFoundPage />,
}
