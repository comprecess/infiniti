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
    shortName: undefined,
    path: Routes.dashboard,
  },
  {
    id: 1,
    name: 'Talents',
    icon: <ProfileIcon />,
    shortName: 'talents',
    openPaths: [
      {
        id: 0,
        title: 'Add Talent',
        path: `${Routes.add}/${Routes.talent}`,
      },
      {
        id: 1,
        title: 'Catalog Talents',
        path: Routes.catalog,
      },
      {
        id: 2,
        title: 'List of Carts',
        path: `${Routes.list}/${Routes.carts}`,
      },
    ],
    path: Routes.talents,
  },
  {
    id: 2,
    name: 'Customers',
    icon: <ProfileIcon />,
    shortName: 'customers',
    openPaths: [
      {
        id: 0,
        title: 'Add Customer',
        path: `${Routes.add}/${Routes.customer}`,
      },
      {
        id: 1,
        title: 'List Customers',
        path: `${Routes.list}/${Routes.customer}`,
      },
      { id: 2, title: 'Companies', path: Routes.companies },
      { id: 3, title: 'Groups', path: Routes.groups },
      { id: 4, title: 'Files', path: Routes.files },
    ],
    path: Routes.customers,
  },
  {
    id: 3,
    name: 'Business Plan',
    icon: <DashboardIcon />,
    shortName: 'business_plan',
    openPaths: [
      { id: 0, title: 'Business Plans', path: Routes.businessPlans },
      {
        id: 1,
        title: 'Make Business Plan',
        path: Routes.makeBusinessPlan,
      },
      { id: 2, title: 'Business Models', path: Routes.businessModels },
    ],
    path: Routes.businessPlan,
  },
  {
    id: 4,
    name: 'Accounting',
    icon: <AccountingIcon />,
    shortName: undefined,
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
    id: 5,
    name: 'Sales',
    icon: <SalesIcon />,
    shortName: 'sales',
    openPaths: [
      { id: 0, title: 'Invoices', path: Routes.invoices },
      {
        id: 1,
        title: 'New Invoice',
        path: `${Routes.new}/${Routes.invoice}`,
      },
      { id: 2, title: 'POS', path: '' },
      { id: 3, title: 'Recurring Invoices', path: '' },
      { id: 4, title: 'New Recurring Invoice', path: '' },
      { id: 5, title: 'Offers', path: Routes.offers },
      {
        id: 6,
        title: 'New Offer',
        path: `${Routes.new}/${Routes.offer}`,
      },
      { id: 7, title: 'Payments', path: '' },
    ],
    path: Routes.sales,
  },
  {
    id: 6,
    name: 'Suppliers',
    icon: <CatalogIcon />,
    shortName: 'suppliers',
    openPaths: [
      {
        id: 0,
        title: 'Add Supplier',
        path: `${Routes.add}/${Routes.supplier}`,
      },
      {
        id: 1,
        title: 'List Suppliers',
        path: `${Routes.list}/${Routes.suppliers}`,
      },
    ],
    path: Routes.suppliers,
  },
  {
    id: 7,
    name: 'Purchase',
    icon: <PurchaseIcon />,
    shortName: 'purchase',
    openPaths: [
      { id: 0, title: 'Purchase Orders', path: '' },
      { id: 1, title: 'New Purchase Order', path: '' },
    ],
    path: Routes.purchase,
  },
  {
    id: 8,
    name: 'Projects',
    icon: <ProjectsIcon />,
    shortName: 'projects',
    path: Routes.projects,
  },
  {
    id: 9,
    name: 'Leads',
    icon: <LeadsIcon />,
    shortName: 'leads',
    openPaths: [
      { id: 0, title: 'Leads', path: '' },
      { id: 1, title: 'Web to Lead', path: '' },
    ],
    path: Routes.leads,
  },
  {
    id: 10,
    name: 'SMS',
    icon: <TicketsIcon />,
    shortName: 'sms',
    openPaths: [
      { id: 0, title: 'Send Single SMS', path: '' },
      { id: 1, title: 'Send Bulk SMS', path: '' },
      { id: 2, title: 'Sent', path: '' },
      { id: 3, title: 'SMS Templates', path: '' },
      { id: 4, title: 'Settings', path: '' },
    ],
    path: Routes.sms,
  },
  {
    id: 11,
    name: 'Support',
    icon: <SupportIcon />,
    shortName: 'support',
    openPaths: [
      { id: 0, title: 'Open New Ticket', path: '' },
      { id: 1, title: 'Tickets', path: '' },
      { id: 2, title: 'Predefined Replies', path: '' },
      { id: 3, title: 'Departments', path: '' },
    ],
    path: Routes.support,
  },
  {
    id: 12,
    name: 'Knowledge Base',
    icon: <KnowledgeBaseIcon />,
    shortName: 'kb',
    openPaths: [
      { id: 0, title: 'New Article', path: '' },
      { id: 1, title: 'All Articles', path: '' },
    ],
    path: Routes.knowledgeBase,
  },
  {
    id: 13,
    name: 'Orders',
    icon: <MyOrdersIcon />,
    shortName: 'orders',
    openPaths: [
      { id: 0, title: 'List All Orders', path: '' },
      { id: 1, title: 'Add New Order', path: '' },
    ],
    path: Routes.myOrders,
  },
  {
    id: 14,
    name: 'HRM',
    icon: <HRMIcon />,
    shortName: 'hr',
    openPaths: [
      { id: 0, title: 'Employees', path: '' },
      { id: 1, title: 'Attendance', path: '' },
      { id: 2, title: 'Payroll', path: '' },
    ],
    path: Routes.hrm,
  },
  {
    id: 15,
    name: 'Documents',
    icon: <DocumentsIcon />,
    shortName: 'documents',
    path: Routes.documents,
  },
  {
    id: 16,
    name: 'Tasks',
    icon: <TasksIcon />,
    shortName: 'tasks',
    path: Routes.tasks,
  },
  {
    id: 17,
    name: 'Calendar',
    icon: <CalendarIcon />,
    shortName: 'calendar',
    path: Routes.calendar,
  },
  {
    id: 18,
    name: 'Products & Services',
    icon: <ProductsServicesIcon />,
    shortName: 'products_n_services',
    openPaths: [
      { id: 0, title: 'Products', path: '' },
      { id: 1, title: 'New Product', path: '' },
      { id: 2, title: 'Services', path: '' },
      { id: 3, title: 'New Service', path: '' },
    ],
    path: Routes.productsServices,
  },
  {
    id: 19,
    name: 'Reports',
    icon: <ReportsIcon />,
    shortName: 'reports',
    openPaths: [
      { id: 0, title: 'Transactions', path: '' },
      { id: 1, title: 'Invoices', path: '' },
      { id: 2, title: 'Purchases', path: '' },
      { id: 3, title: 'Account Statement', path: '' },
      { id: 4, title: 'Income Reports', path: '' },
      { id: 5, title: 'Expense Reports', path: '' },
      { id: 6, title: 'Income Vs Expense', path: '' },
      { id: 7, title: 'Reports by Date', path: '' },
      { id: 8, title: 'All Income', path: '' },
      { id: 9, title: 'All Expense', path: '' },
      { id: 10, title: 'Sales', path: '' },
      { id: 11, title: 'Invoices Vs Expense', path: '' },
      { id: 12, title: 'Export', path: '' },
    ],
    path: Routes.reports,
  },
  {
    id: 20,
    name: 'Utilities',
    icon: <UtilitiesIcon />,
    shortName: 'utilities',
    openPaths: [
      { id: 0, title: 'Activity Log', path: '' },
      { id: 1, title: 'Email Message Log', path: '' },
      { id: 2, title: 'Invoice Access Log', path: '' },
      { id: 3, title: 'Backup', path: '' },
      { id: 4, title: 'Database Status', path: '' },
      { id: 5, title: 'CRON Log', path: '' },
      { id: 6, title: 'Integration Code', path: '' },
      { id: 7, title: 'System Status', path: '' },
      { id: 8, title: 'Password Manager', path: '' },
      { id: 9, title: 'Tools', path: '' },
    ],
    path: Routes.utilities,
  },
  {
    id: 21,
    name: 'Appearance',
    icon: <AppearanceIcon />,
    shortName: 'appearance',
    openPaths: [
      { id: 0, title: 'User Interface', path: '' },
      { id: 1, title: 'Customize', path: '' },
      { id: 2, title: 'Editor', path: '' },
      { id: 3, title: 'Themes', path: '' },
    ],
    path: Routes.appearance,
  },
  {
    id: 22,
    name: 'Plugins',
    icon: <PluginsIcon />,
    shortName: 'plugins',
    path: Routes.plugins,
  },
  {
    id: 23,
    name: 'Settings',
    icon: <SettingsIcon />,
    shortName: 'settings',
    openPaths: [
      { id: 0, title: 'General Settings', path: '' },
      { id: 1, title: 'Users', path: Routes.users },
      { id: 2, title: 'Roles', path: Routes.roles },
      { id: 3, title: 'Localization', path: '' },
      { id: 4, title: 'Currencies', path: Routes.currencies },
      { id: 5, title: 'Payment Gateways', path: '' },
      { id: 6, title: 'Expense Categories', path: '' },
      { id: 7, title: 'Expense Types', path: '' },
      { id: 8, title: 'Income Categories', path: '' },
      { id: 9, title: 'Utils', path: '' },
      { id: 10, title: 'Manage Tags', path: '' },
      { id: 11, title: 'Payment Methods', path: '' },
      { id: 12, title: 'Sales Taxes', path: '' },
      { id: 13, title: 'Email Settings', path: '' },
      { id: 14, title: 'Email Templates', path: '' },
      {
        id: 15,
        title: 'Custom Contact Fields',
        path: `${Routes.custom}/${Routes.contact}/${Routes.fields}`,
      },
      { id: 16, title: 'Automation Settings', path: '' },
      { id: 17, title: 'API Access', path: '' },
      { id: 18, title: 'Choose Features', path: '' },
    ],
    path: Routes.settings,
  },
]
