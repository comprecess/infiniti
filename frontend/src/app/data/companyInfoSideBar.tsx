import { CustomersPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/CustomersPage/CustomersPage'
import { InvoicesPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/InvoicesPage/InvoicesPage'
import { MemoPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/MemoPage/MemoPage'
import { OffersPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/OffersPage/OffersPage'
import { OrdersPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/OrdersPage/OrdersPage'
import { SummaryPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/SummaryPage/SummaryPage'
import { TransactionsPage } from '../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalPages/TransactionsPage/TransactionsPage'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { DocumentsIcon } from '../../shared/icons/sidebarList/DocumentsIcon'
import { FileIcon } from '../../shared/icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
import { MyOrdersIcon } from '../../shared/icons/sidebarList/MyOrdersIcon'
import { ProfileIcon } from '../../shared/icons/sidebarList/ProfileIcon'
import { TransactionsIcon } from '../../shared/icons/sidebarList/TransactionsIcon'

export const CompanyInfoSideBarData = [
  { id: 0, name: 'Summary', icon: <DashboardIcon /> },
  { id: 1, name: 'Memo', icon: <DocumentsIcon /> },
  { id: 2, name: 'Customers', icon: <ProfileIcon /> },
  { id: 3, name: 'Invoices', icon: <InvoicesIcon /> },
  { id: 4, name: 'Offers', icon: <FileIcon /> },
  { id: 5, name: 'Orders', icon: <MyOrdersIcon /> },
  { id: 6, name: 'Transactions', icon: <TransactionsIcon /> },
]

export const CompanyInfoPagesData = [
  SummaryPage,
  MemoPage,
  CustomersPage,
  InvoicesPage,
  OffersPage,
  OrdersPage,
  TransactionsPage,
]
