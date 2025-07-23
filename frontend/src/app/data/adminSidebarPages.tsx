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
import { TalentsIcon } from '../../shared/icons/sidebarList/TalentsIcon'
import { TasksIcon } from '../../shared/icons/sidebarList/TasksIcon'
import { TicketsIcon } from '../../shared/icons/sidebarList/TicketsIcon'
import { UtilitiesIcon } from '../../shared/icons/sidebarList/UtilitiesIcon'
import { Routes } from '../router/routes'

export const adminSidebarPages = [
  {
    id: 0,
    name: 'admin-sidebar-main-page-dashboard',
    icon: <DashboardIcon />,
    path: Routes.dashboard,

    // Access
    shortName: undefined,
  },
  {
    id: 1,
    name: 'admin-sidebar-main-page-talents',
    icon: <TalentsIcon />,
    path: Routes.talents,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-add-talent',
        path: `${Routes.add}/${Routes.talent}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-catalog-talents',
        path: Routes.catalog,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-list-of-carts',
        path: `${Routes.list}/${Routes.carts}`,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'talent',
  },
  {
    id: 2,
    name: 'admin-sidebar-main-page-customers',
    icon: <ProfileIcon />,
    path: Routes.customers,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-add-customer',
        path: `${Routes.add}/${Routes.customer}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-list-customers',
        path: `${Routes.list}/${Routes.customer}`,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-companies',
        path: Routes.companies,

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-groups',
        path: Routes.groups,

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-files',
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
    name: 'admin-sidebar-main-page-business-plan',
    icon: <DashboardIcon />,
    path: Routes.businessPlan,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-business-plans',
        path: Routes.businessPlans,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-make-business-plan',
        path: `${Routes.make}/${Routes.businessPlan}`,

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-business-models',
        path: Routes.businessModels,

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-create-business-models',
        path: `${Routes.make}/${Routes.businessModel}`,

        // Access
        create: true,
      },
    ],

    // Access
    shortName: 'business_plan',
  },
  {
    id: 4,
    name: 'admin-sidebar-main-page-accounting',
    icon: <AccountingIcon />,
    path: Routes.accounting,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-new-deposit',
        path: `${Routes.new}/${Routes.deposit}`,

        // Access
        create: true,
        shortName: 'transactions',
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-new-expense',
        path: `${Routes.new}/${Routes.expense}`,

        // Access
        create: true,
        shortName: 'transactions',
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-transfer',
        path: Routes.transfer,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-bills',
        path: `${Routes.bills}?filterStatus=Summary`,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-view-transactions',
        path: `${Routes.view}/${Routes.transactions}`,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 5,
        title: 'admin-sidebar-subsidiary-page-uncleared-transactions',
        path: Routes.unclearedTransactions,

        // Access
        create: false,
        shortName: 'transactions',
      },
      {
        id: 6,
        title: 'admin-sidebar-subsidiary-page-accounts',
        path: Routes.accounts,

        // Access
        create: false,
        shortName: 'bank_n_cash',
      },
      {
        id: 7,
        title: 'admin-sidebar-subsidiary-page-new-account',
        path: `${Routes.new}/${Routes.account}`,

        // Access
        create: true,
        shortName: 'bank_n_cash',
      },
      {
        id: 8,
        title: 'admin-sidebar-subsidiary-page-assets',
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
    name: 'admin-sidebar-main-page-sales',
    icon: <SalesIcon />,
    path: Routes.sales,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-sales-invoices',
        path: `${Routes.invoices}?filterStatus=Unpaid`,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-new-invoice',
        path: `${Routes.new}/${Routes.invoice}`,

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-pos',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-offers',
        path: Routes.offers,

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-new-offer',
        path: `${Routes.new}/${Routes.offer}`,

        // Access
        create: true,
      },
      {
        id: 5,
        title: 'admin-sidebar-subsidiary-page-payments',
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
    name: 'admin-sidebar-main-page-suppliers',
    icon: <CatalogIcon />,
    path: Routes.suppliers,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-add-supplier',
        path: `${Routes.add}/${Routes.supplier}`,

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-list-suppliers',
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
    name: 'admin-sidebar-main-page-purchase',
    icon: <PurchaseIcon />,
    path: Routes.purchase,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-purchase-orders',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-new-purchase-order',
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
    name: 'admin-sidebar-main-page-projects',
    icon: <ProjectsIcon />,
    path: Routes.projects,

    // Access
    shortName: 'projects',
  },
  {
    id: 9,
    name: 'admin-sidebar-main-page-leads',
    icon: <LeadsIcon />,
    path: Routes.leads,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-leads',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-web-to-Lead',
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
    name: 'admin-sidebar-main-page-sms',
    icon: <TicketsIcon />,
    path: Routes.sms,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-send-single-sms',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-send-bulk-sms',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-sent',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-sms-templates',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-settings',
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
    name: 'admin-sidebar-main-page-support',
    icon: <SupportIcon />,
    path: Routes.support,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-new-ticket',
        path: '',

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-tickets',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-predefined-replies',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-departments',
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
    name: 'admin-sidebar-main-page-knowledge-base',
    icon: <KnowledgeBaseIcon />,
    path: Routes.knowledgeBase,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-new-article',
        path: '',

        // Access
        create: true,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-all-articles',
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
    name: 'admin-sidebar-main-page-orders',
    icon: <MyOrdersIcon />,
    path: Routes.myOrders,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-list-all-orders',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-add-new-order',
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
    name: 'admin-sidebar-main-page-hrm',
    icon: <HRMIcon />,
    path: Routes.hrm,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-employees',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-attendance',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-payroll',
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
    name: 'admin-sidebar-main-page-documents',
    icon: <DocumentsIcon />,
    path: Routes.documents,

    // Access
    shortName: 'documents',
  },
  {
    id: 16,
    name: 'admin-sidebar-main-page-tasks',
    icon: <TasksIcon />,
    path: Routes.tasks,

    // Access
    shortName: 'tasks',
  },
  {
    id: 17,
    name: 'admin-sidebar-main-page-calendar',
    icon: <CalendarIcon />,
    path: Routes.calendar,

    // Access
    shortName: 'calendar',
  },
  {
    id: 18,
    name: 'admin-sidebar-main-page-products-and-services',
    icon: <ProductsServicesIcon />,
    path: Routes.productsServices,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-products',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-new-product',
        path: '',

        // Access
        create: true,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-services',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-new-service',
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
    name: 'admin-sidebar-main-page-reports',
    icon: <ReportsIcon />,
    path: Routes.reports,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-transactions',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-reports-invoices',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-purchases',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-account-statement',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-income-reports',
        path: '',

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'admin-sidebar-subsidiary-page-expense-reports',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'admin-sidebar-subsidiary-page-income-vs-expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'admin-sidebar-subsidiary-page-reports-by-date',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'admin-sidebar-subsidiary-page-all-income',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'admin-sidebar-subsidiary-page-all-expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 10,
        title: 'admin-sidebar-subsidiary-page-sales',
        path: '',

        // Access
        create: false,
      },
      {
        id: 11,
        title: 'admin-sidebar-subsidiary-page-invoices-vs-expense',
        path: '',

        // Access
        create: false,
      },
      {
        id: 12,
        title: 'admin-sidebar-subsidiary-page-export',
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
    name: 'admin-sidebar-main-page-utilities',
    icon: <UtilitiesIcon />,
    path: Routes.utilities,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-activity-log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-email-message-log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-invoice-access-log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-backup',
        path: '',

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-database-status',
        path: '',

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'admin-sidebar-subsidiary-page-cron-log',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'admin-sidebar-subsidiary-page-integration-code',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'admin-sidebar-subsidiary-page-system-status',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'admin-sidebar-subsidiary-page-password-manager',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'admin-sidebar-subsidiary-page-tools',
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
    name: 'admin-sidebar-main-page-appearance',
    icon: <AppearanceIcon />,
    path: Routes.appearance,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-user-interface',
        path: '',

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-customize',
        path: '',

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-editor',
        path: '',

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-themes',
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
    name: 'admin-sidebar-main-page-plugins',
    icon: <PluginsIcon />,
    path: Routes.plugins,

    // Access
    shortName: 'plugins',
  },
  {
    id: 23,
    name: 'admin-sidebar-main-page-settings',
    icon: <SettingsIcon />,
    path: Routes.settings,
    openPaths: [
      {
        id: 0,
        title: 'admin-sidebar-subsidiary-page-general-settings',
        path: Routes.generalSettings,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'admin-sidebar-subsidiary-page-users',
        path: Routes.users,

        // Access
        create: false,
      },
      {
        id: 2,
        title: 'admin-sidebar-subsidiary-page-roles',
        path: Routes.roles,

        // Access
        create: false,
      },
      {
        id: 3,
        title: 'admin-sidebar-subsidiary-page-localization',
        path: Routes.localization,

        // Access
        create: false,
      },
      {
        id: 4,
        title: 'admin-sidebar-subsidiary-page-currencies',
        path: Routes.currencies,

        // Access
        create: false,
      },
      {
        id: 5,
        title: 'admin-sidebar-subsidiary-page-payment-gateways',
        path: '',

        // Access
        create: false,
      },
      {
        id: 6,
        title: 'admin-sidebar-subsidiary-page-expense-categories',
        path: '',

        // Access
        create: false,
      },
      {
        id: 7,
        title: 'admin-sidebar-subsidiary-page-expense-types',
        path: '',

        // Access
        create: false,
      },
      {
        id: 8,
        title: 'admin-sidebar-subsidiary-page-income-categories',
        path: '',

        // Access
        create: false,
      },
      {
        id: 9,
        title: 'admin-sidebar-subsidiary-page-units',
        path: '',

        // Access
        create: false,
      },
      {
        id: 10,
        title: 'admin-sidebar-subsidiary-page-manage-tags',
        path: '',

        // Access
        create: false,
      },
      {
        id: 11,
        title: 'admin-sidebar-subsidiary-page-payment-methods',
        path: '',

        // Access
        create: false,
      },
      {
        id: 12,
        title: 'admin-sidebar-subsidiary-page-sales-taxes',
        path: '',

        // Access
        create: false,
      },
      {
        id: 13,
        title: 'admin-sidebar-subsidiary-page-email-settings',
        path: '',

        // Access
        create: false,
      },
      {
        id: 14,
        title: 'admin-sidebar-subsidiary-page-email-templates',
        path: '',

        // Access
        create: false,
      },
      {
        id: 15,
        title: 'admin-sidebar-subsidiary-page-custom-contact-fields',
        path: `${Routes.custom}/${Routes.contact}/${Routes.fields}`,

        // Access
        create: false,
      },
      {
        id: 16,
        title: 'admin-sidebar-subsidiary-page-automation-settings',
        path: '',

        // Access
        create: false,
      },
      {
        id: 17,
        title: 'admin-sidebar-subsidiary-page-api-access',
        path: '',

        // Access
        create: false,
      },
      {
        id: 18,
        title: 'admin-sidebar-subsidiary-page-choose-features',
        path: '',

        // Access
        create: false,
      },
    ],

    // Access
    shortName: 'settings',
  },
]
