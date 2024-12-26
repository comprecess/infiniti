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
    name: 'client-sidebar-main-page-dashboard',
    icon: <DashboardIcon />,
    path: Routes.dashboard,

    // Access
    shortName: undefined,
  },
  {
    id: 1,
    name: 'client-sidebar-main-page-talents',
    icon: <CatalogIcon />,
    path: Routes.talents,

    // Access
    shortName: undefined,
  },
  {
    id: 2,
    name: 'client-sidebar-main-page-business-models',
    icon: <DashboardIcon />,
    path: Routes.businessModels,

    // Access
    shortName: undefined,
  },
  {
    id: 3,
    name: 'client-sidebar-main-page-my-orders',
    icon: <MyOrdersIcon />,
    path: Routes.myOrders,

    // Access
    shortName: undefined,
  },
  {
    id: 4,
    name: 'client-sidebar-main-page-transactions',
    icon: <TransactionsIcon />,
    path: Routes.transactions,

    // Access
    shortName: undefined,
  },
  {
    id: 5,
    name: 'client-sidebar-main-page-documents',
    icon: <DocumentsIcon />,
    path: Routes.documents,

    // Access
    shortName: undefined,
  },
  {
    id: 6,
    name: 'client-sidebar-main-page-invoices',
    icon: <InvoicesIcon />,
    path: Routes.invoices,

    // Access
    shortName: undefined,
  },
  {
    id: 7,
    name: 'client-sidebar-main-page-offers',
    icon: <OffersIcon />,
    path: Routes.offers,

    // Access
    shortName: undefined,
  },
  {
    id: 8,
    name: 'client-sidebar-main-page-projects',
    icon: <ProjectsIcon />,
    path: Routes.projects,

    // Access
    shortName: undefined,
  },
  {
    id: 9,
    name: 'client-sidebar-main-page-knowledge-base',
    icon: <KnowledgeBaseIcon />,
    path: Routes.knowledgeBase,

    // Access
    shortName: undefined,
  },
  {
    id: 10,
    name: 'client-sidebar-main-page-tickets',
    icon: <TicketsIcon />,
    path: Routes.tickets,
    openPaths: [
      {
        id: 0,
        title: 'client-sidebar-subsidiary-page-new-ticket',
        path: Routes.openNewTicket,

        // Access
        create: false,
      },
      {
        id: 1,
        title: 'client-sidebar-subsidiary-page-tickets',
        path: Routes.tickets,

        // Access
        create: false,
      },
    ],

    // Access
    shortName: undefined,
  },
  {
    id: 11,
    name: 'client-sidebar-main-page-profile',
    icon: <ProfileIcon />,
    path: Routes.profile,

    // Access
    shortName: undefined,
  },
]
