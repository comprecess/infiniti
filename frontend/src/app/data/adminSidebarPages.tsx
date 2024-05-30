import { AccountingIcon } from '../../shared/icons/sidebarList/AccountingIcon'
import { AppearanceIcon } from '../../shared/icons/sidebarList/AppearanceIcon'
import { CalendarIcon } from '../../shared/icons/sidebarList/CalendarIcon'
import { CatalogIcon } from '../../shared/icons/sidebarList/CatalogIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { DocumentsIcon } from '../../shared/icons/sidebarList/DocumentsIcon'
import { HRMIcon } from '../../shared/icons/sidebarList/HRMIcon'
import { KnowledgeBaseIcon } from '../../shared/icons/sidebarList/KnowledgeBaseIcon'
import { LeadsIcon } from '../../shared/icons/sidebarList/LeadsIcon'
import { MyOrdersIcon } from '../../shared/icons/sidebarList/MyOrdersIcon'
import { PluginsIcon } from '../../shared/icons/sidebarList/PluginsIcon'
import { ProductsServicesIcon } from '../../shared/icons/sidebarList/ProductsServicesIcon'
import { ProfileIcon } from '../../shared/icons/sidebarList/ProfileIcon'
import { ProjectsIcon } from '../../shared/icons/sidebarList/ProjectsIcon'
import { PurchaseIcon } from '../../shared/icons/sidebarList/PurchaseIcon'
import { ReportsIcon } from '../../shared/icons/sidebarList/ReportsIcon'
import { SalesIcon } from '../../shared/icons/sidebarList/SalesIcon'
import { SettingsIcon } from '../../shared/icons/sidebarList/SettingsIcon'
import { SupportIcon } from '../../shared/icons/sidebarList/SupportIcon'
import { TasksIcon } from '../../shared/icons/sidebarList/TasksIcon'
import { TicketsIcon } from '../../shared/icons/sidebarList/TicketsIcon'
import { UtilitiesIcon } from '../../shared/icons/sidebarList/UtilitiesIcon'
import { Routes } from '../router/routes'

export const adminSidebarPages = [
  {
    id: 0,
    name: 'Dashboard',
    icon: <DashboardIcon />,
    path: Routes.dashboard,
  },
  {
    id: 1,
    name: 'Customers',
    icon: <ProfileIcon />,
    openPaths: [
      { id: 0, title: 'Add Customer', path: Routes.addCustomer },
      { id: 1, title: 'List Customer', path: Routes.listCustomer },
      { id: 2, title: 'Companies', path: Routes.companies },
      { id: 3, title: 'Groups', path: Routes.groups },
      { id: 4, title: 'Files', path: Routes.files },
    ],
    path: Routes.customers,
  },
  {
    id: 2,
    name: 'Business Plan',
    icon: <DashboardIcon />,
    openPaths: [
      {
        id: 0,
        title: 'Make Business Plan',
        path: Routes.makeBusinessPlan,
      },
      { id: 1, title: 'Business Plan', path: Routes.businessPlan },
    ],
    path: Routes.businessPlan,
  },
  {
    id: 3,
    name: 'Accounting',
    icon: <AccountingIcon />,
    openPaths: [
      { id: 0, title: 'New Deposit', path: Routes.newDeposit },
      { id: 1, title: 'New Expense', path: Routes.newExpense },
      { id: 2, title: 'Transfer', path: Routes.transfer },
      { id: 3, title: 'Bills', path: Routes.bills },
      { id: 4, title: 'View Transactions', path: Routes.viewTransactions },
      {
        id: 5,
        title: 'Uncleared Transactions',
        path: Routes.unclearedTransactions,
      },
      { id: 6, title: 'Accounts', path: Routes.accounts },
      { id: 7, title: 'New Account', path: Routes.newAccount },
      { id: 8, title: 'Assets', path: Routes.assets },
    ],
    path: Routes.accounting,
  },
  {
    id: 4,
    name: 'Sales',
    icon: <SalesIcon />,
    openPaths: [
      { id: 0, title: 'Invoices' },
      { id: 1, title: 'New Invoice' },
      { id: 2, title: 'POS' },
      { id: 3, title: 'Recurring Invoices' },
      { id: 4, title: 'New Recurring Invoice' },
      { id: 5, title: 'Offers' },
      { id: 6, title: 'Create New Offer' },
      { id: 7, title: 'Payments' },
    ],
    path: Routes.sales,
  },
  {
    id: 5,
    name: 'Suppliers',
    icon: <CatalogIcon />,
    openPaths: [
      { id: 0, title: 'Add Supplier' },
      { id: 1, title: 'List Suppliers' },
    ],
    path: Routes.suppliers,
  },
  {
    id: 6,
    name: 'Purchase',
    icon: <PurchaseIcon />,
    openPaths: [
      { id: 0, title: 'Purchase Orders' },
      { id: 1, title: 'New Purchase Order' },
    ],
    path: Routes.purchase,
  },
  {
    id: 7,
    name: 'Projects',
    icon: <ProjectsIcon />,
    path: Routes.projects,
  },
  {
    id: 8,
    name: 'Leads',
    icon: <LeadsIcon />,
    openPaths: [
      { id: 0, title: 'Leads' },
      { id: 1, title: 'Web to Lead' },
    ],
    path: Routes.leads,
  },
  {
    id: 9,
    name: 'SMS',
    icon: <TicketsIcon />,
    openPaths: [
      { id: 0, title: 'Send Single SMS' },
      { id: 1, title: 'Send Bulk SMS' },
      { id: 2, title: 'Sent' },
      { id: 3, title: 'SMS Templates' },
      { id: 4, title: 'Settings' },
    ],
    path: Routes.sms,
  },
  {
    id: 10,
    name: 'Support',
    icon: <SupportIcon />,
    openPaths: [
      { id: 0, title: 'Open New Ticket' },
      { id: 1, title: 'Tickets' },
      { id: 2, title: 'Predefined Replies' },
      { id: 3, title: 'Departments' },
    ],
    path: Routes.support,
  },
  {
    id: 11,
    name: 'Knowledge Base',
    icon: <KnowledgeBaseIcon />,
    openPaths: [
      { id: 0, title: 'New Article' },
      { id: 1, title: 'All Articles' },
    ],
    path: Routes.knowledgeBase,
  },
  {
    id: 12,
    name: 'Orders',
    icon: <MyOrdersIcon />,
    openPaths: [
      { id: 0, title: 'List All Orders' },
      { id: 1, title: 'Add New Order' },
    ],
    path: Routes.myOrders,
  },
  {
    id: 13,
    name: 'HRM',
    icon: <HRMIcon />,
    openPaths: [
      { id: 0, title: 'Employees' },
      { id: 1, title: 'Attendance' },
      { id: 2, title: 'Payroll' },
    ],
    path: Routes.hrm,
  },
  {
    id: 14,
    name: 'Documents',
    icon: <DocumentsIcon />,
    path: Routes.documents,
  },
  {
    id: 15,
    name: 'Tasks',
    icon: <TasksIcon />,
    path: Routes.tasks,
  },
  {
    id: 16,
    name: 'Calendar',
    icon: <CalendarIcon />,
    path: Routes.calendar,
  },
  {
    id: 17,
    name: 'Products & Services',
    icon: <ProductsServicesIcon />,
    openPaths: [
      { id: 0, title: 'Products' },
      { id: 1, title: 'New Product' },
      { id: 2, title: 'Services' },
      { id: 3, title: 'New Service' },
    ],
    path: Routes.productsServices,
  },
  {
    id: 18,
    name: 'Reports',
    icon: <ReportsIcon />,
    openPaths: [
      { id: 0, title: 'Transactions' },
      { id: 1, title: 'Invoices' },
      { id: 2, title: 'Purchases' },
      { id: 3, title: 'Account Statement' },
      { id: 4, title: 'Income Reports' },
      { id: 5, title: 'Expense Reports' },
      { id: 6, title: 'Income Vs Expense' },
      { id: 7, title: 'Reports by Date' },
      { id: 8, title: 'All Income' },
      { id: 9, title: 'All Expense' },
      { id: 10, title: 'Sales' },
      { id: 11, title: 'Invoices Vs Expense' },
      { id: 12, title: 'Export' },
    ],
    path: Routes.reports,
  },
  {
    id: 19,
    name: 'Utilities',
    icon: <UtilitiesIcon />,
    openPaths: [
      { id: 0, title: 'Activity Log' },
      { id: 1, title: 'Email Message Log' },
      { id: 2, title: 'Invoice Access Log' },
      { id: 3, title: 'Backup' },
      { id: 4, title: 'Database Status' },
      { id: 5, title: 'CRON Log' },
      { id: 6, title: 'Integration Code' },
      { id: 7, title: 'System Status' },
      { id: 8, title: 'Password Manager' },
      { id: 9, title: 'Tools' },
    ],
    path: Routes.utilities,
  },
  {
    id: 20,
    name: 'Appearance',
    icon: <AppearanceIcon />,
    openPaths: [
      { id: 0, title: 'User Interface' },
      { id: 1, title: 'Customize' },
      { id: 2, title: 'Editor' },
      { id: 3, title: 'Themes' },
    ],
    path: Routes.appearance,
  },
  {
    id: 21,
    name: 'Plugins',
    icon: <PluginsIcon />,
    path: Routes.plugins,
  },
  {
    id: 22,
    name: 'Settings',
    icon: <SettingsIcon />,
    openPaths: [
      { id: 0, title: 'General Settings' },
      { id: 1, title: 'Staff' },
      { id: 2, title: 'Roles' },
      { id: 3, title: 'Localization' },
      { id: 4, title: 'Currencies' },
      { id: 5, title: 'Payment Gateways' },
      { id: 6, title: 'Expense Categories' },
      { id: 7, title: 'Expense Types' },
      { id: 8, title: 'Income Categories' },
      { id: 9, title: 'Utils' },
      { id: 10, title: 'Manage Tags' },
      { id: 11, title: 'Payment Methods' },
      { id: 12, title: 'Sales Taxes' },
      { id: 13, title: 'Email Settings' },
      { id: 14, title: 'Email Templates' },
      { id: 15, title: 'Custom Contact Fields' },
      { id: 16, title: 'Automation Settings' },
      { id: 17, title: 'API Access' },
      { id: 18, title: 'Choose Features' },
    ],
    path: Routes.settings,
  },
]
