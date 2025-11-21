import { BookOpenIcon } from '../../shared/icons/BookOpenIcon'
import { ChartIcon } from '../../shared/icons/ChartIcon'
import { ExpensesIcon } from '../../shared/icons/ExpensesIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { FileIcon } from '../../shared/icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
import { LogIcon } from '../../shared/icons/sidebarList/LogIcon'
import { TasksIcon } from '../../shared/icons/sidebarList/TasksIcon'

export const ProjectInfoSidebar = [
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
  {
    id: 5,
    name: 'Gantt Chart',
    page: 'gantt-chart',
    type: 'gantt-chart',
    icon: <ChartIcon />,
  },
  {
    id: 6,
    name: 'Analytics',
    page: 'analytics',
    type: 'analytics',
    icon: <BookOpenIcon />,
  },
  {
    id: 7,
    name: 'Logs',
    page: 'logs',
    type: 'logs',
    icon: <LogIcon />,
  },
]
