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
    chevron: false,
    path: Routes.dashboard,
  },
  {
    id: 1,
    name: 'Catalog',
    icon: <CatalogIcon />,
    chevron: false,
    path: Routes.catalog,
  },
  {
    id: 2,
    name: 'My orders',
    icon: <MyOrdersIcon />,
    chevron: false,
    path: Routes.myOrders,
  },
  {
    id: 3,
    name: 'Transactions',
    icon: <TransactionsIcon />,
    chevron: false,
    path: Routes.transactions,
  },
  {
    id: 4,
    name: 'Documents',
    icon: <DocumentsIcon />,
    chevron: false,
    path: Routes.documents,
  },
  {
    id: 5,
    name: 'Invoices',
    icon: <InvoicesIcon />,
    chevron: false,
    path: Routes.invoices,
  },
  {
    id: 6,
    name: 'Offers',
    icon: <OffersIcon />,
    chevron: false,
    path: Routes.offers,
  },
  {
    id: 7,
    name: 'Projects',
    icon: <ProjectsIcon />,
    chevron: false,
    path: Routes.projects,
  },
  {
    id: 8,
    name: 'Knowledge base',
    icon: <KnowledgeBaseIcon />,
    chevron: false,
    path: Routes.knowledgeBase,
  },
  {
    id: 9,
    name: 'Tickets',
    icon: <TicketsIcon />,
    chevron: true,
    path: 'tickets',
  },
  {
    id: 10,
    name: 'Profile',
    icon: <ProfileIcon />,
    chevron: false,
    path: 'profile',
  },
]
