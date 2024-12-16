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

    // Access
    shortName: undefined,
  },
  {
    id: 1,
    name: 'Talents',
    icon: <ProfileIcon />,
    path: Routes.talents,
    openPaths: [
      {
        id: 0,
        title: 'Add Talent',
        path: `${Routes.add}/${Routes.talent}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'Catalog Talents',
        path: Routes.catalog,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'List of Carts',
        path: `${Routes.list}/${Routes.carts}`,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'talents',
  },
  {
    id: 2,
    name: 'Customers',
    icon: <ProfileIcon />,
    path: Routes.customers,
    openPaths: [
      {
        id: 0,
        title: 'Add Customer',
        path: `${Routes.add}/${Routes.customer}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'List Customers',
        path: `${Routes.list}/${Routes.customer}`,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Companies',
        path: Routes.companies,

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Groups',
        path: Routes.groups,

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Files',
        path: Routes.files,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'customers',
  },
  {
    id: 3,
    name: 'Business Plan',
    icon: <DashboardIcon />,
    path: Routes.businessPlan,
    openPaths: [
      {
        id: 0,
        title: 'Business Plans',
        path: Routes.businessPlans,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Make Business Plan',
        path: Routes.makeBusinessPlan,

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'Business Models',
        path: Routes.businessModels,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'business_plan',
  },
  {
    id: 4,
    name: 'Accounting',
    icon: <AccountingIcon />,
    path: Routes.accounting,
    openPaths: [
      {
        id: 0,
        title: 'New Deposit',
        path: Routes.newDeposit,

        // Access
        create: true,
        shortName: 'transactions',
      },
      {
        id: 1,
        title: 'New Expense',
        path: Routes.newExpense,

        // Access
        create: true,
        shortName: 'transactions',
      },
      {
        id: 2,
        title: 'Transfer',
        path: Routes.transfer,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 3,
        title: 'Bills',
        path: Routes.bills,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 4,
        title: 'View Transactions',
        path: Routes.viewTransactions,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 5,
        title: 'Uncleared Transactions',
        path: Routes.unclearedTransactions,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 6,
        title: 'Accounts',
        path: Routes.accounts,

        // Access
        create: false,
        shortName: 'bank_n_cash',
      },
      {
        id: 7,
        title: 'New Account',
        path: Routes.newAccount,

        // Access
        create: true,
        shortName: 'bank_n_cash',
      },
      {
        id: 8,
        title: 'Assets',
        path: Routes.assets,

        // Access
        create: false,
        shortName: 'assets',
      },
    ],

    // Access
    shortName: 'accounting',
  },
  {
    id: 5,
    name: 'Sales',
    icon: <SalesIcon />,
    path: Routes.sales,
    openPaths: [
      {
        id: 0,
        title: 'Invoices',
        path: Routes.invoices,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'New Invoice',
        path: `${Routes.new}/${Routes.invoice}`,

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'POS',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Recurring Invoices',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Offers',
        path: Routes.offers,

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'New Offer',
        path: `${Routes.new}/${Routes.offer}`,

        // Access
        create: true,
      },
      {
        id: 6,
        title: 'Payments',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'sales',
  },
  {
    id: 6,
    name: 'Suppliers',
    icon: <CatalogIcon />,
    path: Routes.suppliers,
    openPaths: [
      {
        id: 0,
        title: 'Add Supplier',
        path: `${Routes.add}/${Routes.supplier}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'List Suppliers',
        path: `${Routes.list}/${Routes.suppliers}`,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'suppliers',
  },
  {
    id: 7,
    name: 'Purchase',
    icon: <PurchaseIcon />,
    path: Routes.purchase,
    openPaths: [
      {
        id: 0,
        title: 'Purchase Orders',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'New Purchase Order',
        path: '',

        // Access
        create: true,
      },
    ],

    // Access
    shortName: 'purchase',
  },
  {
    id: 8,
    name: 'Projects',
    icon: <ProjectsIcon />,
    path: Routes.projects,

    // Access
    shortName: 'projects',
  },
  {
    id: 9,
    name: 'Leads',
    icon: <LeadsIcon />,
    path: Routes.leads,
    openPaths: [
      {
        id: 0,
        title: 'Leads',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Web to Lead',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'leads',
  },
  {
    id: 10,
    name: 'SMS',
    icon: <TicketsIcon />,
    path: Routes.sms,
    openPaths: [
      {
        id: 0,
        title: 'Send Single SMS',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Send Bulk SMS',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Sent',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'SMS Templates',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Settings',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'sms',
  },
  {
    id: 11,
    name: 'Support',
    icon: <SupportIcon />,
    path: Routes.support,
    openPaths: [
      {
        id: 0,
        title: 'New Ticket',
        path: '',

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'Tickets',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Predefined Replies',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Departments',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'support',
  },
  {
    id: 12,
    name: 'Knowledge Base',
    icon: <KnowledgeBaseIcon />,
    path: Routes.knowledgeBase,
    openPaths: [
      {
        id: 0,
        title: 'New Article',
        path: '',

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'All Articles',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'kb',
  },
  {
    id: 13,
    name: 'Orders',
    icon: <MyOrdersIcon />,
    path: Routes.myOrders,
    openPaths: [
      {
        id: 0,
        title: 'List All Orders',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Add New Order',
        path: '',

        // Access
        create: true,
      },
    ],

    // Access
    shortName: 'orders',
  },
  {
    id: 14,
    name: 'HRM',
    icon: <HRMIcon />,
    path: Routes.hrm,
    openPaths: [
      {
        id: 0,
        title: 'Employees',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Attendance',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Payroll',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'hr',
  },
  {
    id: 15,
    name: 'Documents',
    icon: <DocumentsIcon />,
    path: Routes.documents,

    // Access
    shortName: 'documents',
  },
  {
    id: 16,
    name: 'Tasks',
    icon: <TasksIcon />,
    path: Routes.tasks,

    // Access
    shortName: 'tasks',
  },
  {
    id: 17,
    name: 'Calendar',
    icon: <CalendarIcon />,
    path: Routes.calendar,

    // Access
    shortName: 'calendar',
  },
  {
    id: 18,
    name: 'Products & Services',
    icon: <ProductsServicesIcon />,
    path: Routes.productsServices,
    openPaths: [
      {
        id: 0,
        title: 'Products',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'New Product',
        path: '',

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'Services',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'New Service',
        path: '',

        // Access
        create: true,
      },
    ],

    // Access
    shortName: 'products_n_services',
  },
  {
    id: 19,
    name: 'Reports',
    icon: <ReportsIcon />,
    path: Routes.reports,
    openPaths: [
      {
        id: 0,
        title: 'Transactions',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Invoices',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Purchases',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Account Statement',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Income Reports',
        path: '',

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'Expense Reports',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'Income Vs Expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'Reports by Date',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'All Income',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'All Expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 10,
        title: 'Sales',
        path: '',

        // Access
        create: false,
      },
      {
        id: 11,
        title: 'Invoices Vs Expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 12,
        title: 'Export',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'reports',
  },
  {
    id: 20,
    name: 'Utilities',
    icon: <UtilitiesIcon />,
    path: Routes.utilities,
    openPaths: [
      {
        id: 0,
        title: 'Activity Log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Email Message Log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Invoice Access Log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Backup',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Database Status',
        path: '',

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'CRON Log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'Integration Code',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'System Status',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'Password Manager',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'Tools',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'utilities',
  },
  {
    id: 21,
    name: 'Appearance',
    icon: <AppearanceIcon />,
    path: Routes.appearance,
    openPaths: [
      {
        id: 0,
        title: 'User Interface',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Customize',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Editor',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Themes',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'appearance',
  },
  {
    id: 22,
    name: 'Plugins',
    icon: <PluginsIcon />,
    path: Routes.plugins,

    // Access
    shortName: 'plugins',
  },
  {
    id: 23,
    name: 'Settings',
    icon: <SettingsIcon />,
    path: Routes.settings,
    openPaths: [
      {
        id: 0,
        title: 'General Settings',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'Users',
        path: Routes.users,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'Roles',
        path: Routes.roles,

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'Localization',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'Currencies',
        path: Routes.currencies,

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'Payment Gateways',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'Expense Categories',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'Expense Types',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'Income Categories',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'Utils',
        path: '',

        // Access
        create: false,
      },
      {
        id: 10,
        title: 'Manage Tags',
        path: '',

        // Access
        create: false,
      },
      {
        id: 11,
        title: 'Payment Methods',
        path: '',

        // Access
        create: false,
      },
      {
        id: 12,
        title: 'Sales Taxes',
        path: '',

        // Access
        create: false,
      },
      {
        id: 13,
        title: 'Email Settings',
        path: '',

        // Access
        create: false,
      },
      {
        id: 14,
        title: 'Email Templates',
        path: '',

        // Access
        create: false,
      },
      {
        id: 15,
        title: 'Custom Contact Fields',
        path: `${Routes.custom}/${Routes.contact}/${Routes.fields}`,

        // Access
        create: false,
      },
      {
        id: 16,
        title: 'Automation Settings',
        path: '',

        // Access
        create: false,
      },
      {
        id: 17,
        title: 'API Access',
        path: '',

        // Access
        create: false,
      },
      {
        id: 18,
        title: 'Choose Features',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'settings',
  },
]
