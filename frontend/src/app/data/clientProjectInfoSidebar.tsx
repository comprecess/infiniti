import { ExpensesIcon } from '../../shared/icons/ExpensesIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { FileIcon } from '../../shared/icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
import { TasksIcon } from '../../shared/icons/sidebarList/TasksIcon'

export const ClientCustomerProjectInfoSidebar = [
  {
    id: 0,
    name: 'Summary',
    page: 'summary',
    type: 'summary',
    icon: <DashboardIcon />,
  },
  {
    id: 1,
    name: 'Tasks',
    page: 'tasks',
    type: 'tasks',
    icon: <TasksIcon />,
  },
  {
    id: 2,
    name: 'Files',
    page: 'files',
    type: 'files',
    icon: <FileIcon />,
  },
  {
    id: 3,
    name: 'Expenses',
    page: 'expenses',
    type: 'expenses',
    icon: <ExpensesIcon />,
  },
  {
    id: 4,
    name: 'Invoices',
    page: 'invoices',
    type: 'invoices',
    icon: <InvoicesIcon />,
  },
]

export const ClientSupplierProjectInfoSidebar = [
  {
    id: 0,
    name: 'Summary',
    page: 'summary',
    type: 'summary',
    icon: <DashboardIcon />,
  },
  {
    id: 1,
    name: 'Tasks',
    page: 'tasks',
    type: 'tasks',
    icon: <TasksIcon />,
  },
  {
    id: 2,
    name: 'Files',
    page: 'files',
    type: 'files',
    icon: <FileIcon />,
  },
]
