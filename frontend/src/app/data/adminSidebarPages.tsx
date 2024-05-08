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
    chevron: false,
    path: Routes.dashboard,
  },
  {
    id: 1,
    name: 'Customers',
    icon: <ProfileIcon />,
    chevron: true,
    path: Routes.customers,
  },
  {
    id: 2,
    name: 'Business Plan',
    icon: <DashboardIcon />,
    chevron: true,
    path: Routes.businessPlan,
  },
  {
    id: 3,
    name: 'Accounting',
    icon: <AccountingIcon />,
    chevron: true,
    path: Routes.accounting,
  },
  {
    id: 4,
    name: 'Sales',
    icon: <SalesIcon />,
    chevron: true,
    path: Routes.sales,
  },
  {
    id: 5,
    name: 'Suppliers',
    icon: <CatalogIcon />,
    chevron: true,
    path: Routes.suppliers,
  },
  {
    id: 6,
    name: 'Purchase',
    icon: <PurchaseIcon />,
    chevron: true,
    path: Routes.purchase,
  },
  {
    id: 7,
    name: 'Projects',
    icon: <ProjectsIcon />,
    chevron: true,
    path: Routes.projects,
  },
  {
    id: 8,
    name: 'Leads',
    icon: <LeadsIcon />,
    chevron: true,
    path: Routes.leads,
  },
  {
    id: 9,
    name: 'SMS',
    icon: <TicketsIcon />,
    chevron: true,
    path: Routes.sms,
  },
  {
    id: 10,
    name: 'Support',
    icon: <SupportIcon />,
    chevron: true,
    path: Routes.support,
  },
  {
    id: 11,
    name: 'Knowledge Base',
    icon: <KnowledgeBaseIcon />,
    chevron: true,
    path: Routes.knowledgeBase,
  },
  {
    id: 12,
    name: 'Orders',
    icon: <MyOrdersIcon />,
    chevron: true,
    path: Routes.myOrders,
  },
  {
    id: 13,
    name: 'HRM',
    icon: <HRMIcon />,
    chevron: true,
    path: Routes.hrm,
  },
  {
    id: 14,
    name: 'Documents',
    icon: <DocumentsIcon />,
    chevron: true,
    path: Routes.documents,
  },
  {
    id: 15,
    name: 'Tasks',
    icon: <TasksIcon />,
    chevron: false,
    path: Routes.tasks,
  },
  {
    id: 16,
    name: 'Calendar',
    icon: <CalendarIcon />,
    chevron: false,
    path: Routes.calendar,
  },
  {
    id: 17,
    name: 'Products & Services',
    icon: <ProductsServicesIcon />,
    chevron: true,
    path: Routes.productsServices,
  },
  {
    id: 18,
    name: 'Reports',
    icon: <ReportsIcon />,
    chevron: true,
    path: Routes.reports,
  },
  {
    id: 19,
    name: 'Utilities',
    icon: <UtilitiesIcon />,
    chevron: true,
    path: Routes.utilities,
  },
  {
    id: 20,
    name: 'Appearance',
    icon: <AppearanceIcon />,
    chevron: true,
    path: Routes.appearance,
  },
  {
    id: 21,
    name: 'Plugins',
    icon: <PluginsIcon />,
    chevron: false,
    path: Routes.plugins,
  },
  {
    id: 22,
    name: 'Settings',
    icon: <SettingsIcon />,
    chevron: true,
    path: Routes.settings,
  },
]
