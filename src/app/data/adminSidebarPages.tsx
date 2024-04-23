import { AccountingIcon } from '../../shared/icons/dashboardsList/AccountingIcon'
import { AppearanceIcon } from '../../shared/icons/dashboardsList/AppearanceIcon'
import { CalendarIcon } from '../../shared/icons/dashboardsList/CalendarIcon'
import { CatalogIcon } from '../../shared/icons/dashboardsList/CatalogIcon'
import { DashboardIcon } from '../../shared/icons/dashboardsList/DashboardIcon'
import { DocumentsIcon } from '../../shared/icons/dashboardsList/DocumentsIcon'
import { HRMIcon } from '../../shared/icons/dashboardsList/HRMIcon'
import { KnowledgeBaseIcon } from '../../shared/icons/dashboardsList/KnowledgeBaseIcon'
import { LeadsIcon } from '../../shared/icons/dashboardsList/LeadsIcon'
import { MyOrdersIcon } from '../../shared/icons/dashboardsList/MyOrdersIcon'
import { PluginsIcon } from '../../shared/icons/dashboardsList/PluginsIcon'
import { ProductsServicesIcon } from '../../shared/icons/dashboardsList/ProductsServicesIcon'
import { ProfileIcon } from '../../shared/icons/dashboardsList/ProfileIcon'
import { ProjectsIcon } from '../../shared/icons/dashboardsList/ProjectsIcon'
import { PurchaseIcon } from '../../shared/icons/dashboardsList/PurchaseIcon'
import { ReportsIcon } from '../../shared/icons/dashboardsList/ReportsIcon'
import { SalesIcon } from '../../shared/icons/dashboardsList/SalesIcon'
import { SettingsIcon } from '../../shared/icons/dashboardsList/SettingsIcon'
import { SupportIcon } from '../../shared/icons/dashboardsList/SupportIcon'
import { TasksIcon } from '../../shared/icons/dashboardsList/TasksIcon'
import { TicketsIcon } from '../../shared/icons/dashboardsList/TicketsIcon'
import { UtilitiesIcon } from '../../shared/icons/dashboardsList/UtilitiesIcon'
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
    path: Routes.customers,
  },
  {
    id: 2,
    name: 'Business Plan',
    icon: <DashboardIcon />,
    path: Routes.businessPlan,
  },
  {
    id: 3,
    name: 'Accounting',
    icon: <AccountingIcon />,
    path: Routes.accounting,
  },
  {
    id: 4,
    name: 'Sales',
    icon: <SalesIcon />,
    path: Routes.sales,
  },
  {
    id: 5,
    name: 'Suppliers',
    icon: <CatalogIcon />,
    path: Routes.suppliers,
  },
  {
    id: 6,
    name: 'Purchase',
    icon: <PurchaseIcon />,
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
    path: Routes.leads,
  },
  {
    id: 9,
    name: 'SMS',
    icon: <TicketsIcon />,
    path: Routes.sms,
  },
  {
    id: 10,
    name: 'Support',
    icon: <SupportIcon />,
    path: Routes.support,
  },
  {
    id: 11,
    name: 'Knowledge Base',
    icon: <KnowledgeBaseIcon />,
    path: Routes.knowledgeBase,
  },
  {
    id: 12,
    name: 'Orders',
    icon: <MyOrdersIcon />,
    path: Routes.myOrders,
  },
  {
    id: 13,
    name: 'HRM',
    icon: <HRMIcon />,
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
    path: Routes.productsServices,
  },
  {
    id: 18,
    name: 'Reports',
    icon: <ReportsIcon />,
    path: Routes.reports,
  },
  {
    id: 19,
    name: 'Utilities',
    icon: <UtilitiesIcon />,
    path: Routes.utilities,
  },
  {
    id: 20,
    name: 'Appearance',
    icon: <AppearanceIcon />,
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
    path: Routes.settings,
  },
]
