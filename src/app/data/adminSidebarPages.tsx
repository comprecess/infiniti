import { CatalogIcon } from '../../shared/icons/dashboardsList/CatalogIcon'
import { DashboardIcon } from '../../shared/icons/dashboardsList/DashboardIcon'
import { DocumentsIcon } from '../../shared/icons/dashboardsList/DocumentsIcon'
import { InvoicesIcon } from '../../shared/icons/dashboardsList/InvoicesIcon'
import { KnowledgeBaseIcon } from '../../shared/icons/dashboardsList/KnowledgeBaseIcon'
import { MyOrdersIcon } from '../../shared/icons/dashboardsList/MyOrdersIcon'
import { OffersIcon } from '../../shared/icons/dashboardsList/OffersIcon'
import { ProfileIcon } from '../../shared/icons/dashboardsList/ProfileIcon'
import { ProjectsIcon } from '../../shared/icons/dashboardsList/ProjectsIcon'
import { TicketsIcon } from '../../shared/icons/dashboardsList/TicketsIcon'
import { TransactionsIcon } from '../../shared/icons/dashboardsList/TransactionsIcon'
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
    name: 'Catalog',
    icon: <CatalogIcon />,
    path: Routes.catalog,
  },
  {
    id: 2,
    name: 'My orders',
    icon: <MyOrdersIcon />,
    path: Routes.myOrders,
  },
  {
    id: 3,
    name: 'Transactions',
    icon: <TransactionsIcon />,
    path: Routes.transactions,
  },
  {
    id: 4,
    name: 'Documents',
    icon: <DocumentsIcon />,
    path: Routes.documents,
  },
  {
    id: 5,
    name: 'Invoices',
    icon: <InvoicesIcon />,
    path: Routes.invoices,
  },
  {
    id: 6,
    name: 'Offers',
    icon: <OffersIcon />,
    path: Routes.offers,
  },
  {
    id: 7,
    name: 'Projects',
    icon: <ProjectsIcon />,
    path: Routes.projects,
  },
  {
    id: 8,
    name: 'Knowledge base',
    icon: <KnowledgeBaseIcon />,
    path: Routes.knowledgeBase,
  },
  {
    id: 9,
    name: 'Tickets',
    icon: <TicketsIcon />,
    path: 'tickets',
  },
  {
    id: 10,
    name: 'Profile',
    icon: <ProfileIcon />,
    path: 'profile',
  },
]
