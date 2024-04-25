import { CatalogIcon } from '../../shared/icons/sidebarList/CatalogIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { DocumentsIcon } from '../../shared/icons/sidebarList/DocumentsIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
import { KnowledgeBaseIcon } from '../../shared/icons/sidebarList/KnowledgeBaseIcon'
import { MyOrdersIcon } from '../../shared/icons/sidebarList/MyOrdersIcon'
import { OffersIcon } from '../../shared/icons/sidebarList/OffersIcon'
import { ProfileIcon } from '../../shared/icons/sidebarList/ProfileIcon'
import { ProjectsIcon } from '../../shared/icons/sidebarList/ProjectsIcon'
import { TicketsIcon } from '../../shared/icons/sidebarList/TicketsIcon'
import { TransactionsIcon } from '../../shared/icons/sidebarList/TransactionsIcon'
import { Routes } from '../router/routes'

export const clientSidebarPages = [
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
