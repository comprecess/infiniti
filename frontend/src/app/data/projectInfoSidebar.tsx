import { BookOpenIcon } from '../../shared/icons/BookOpenIcon'
import { ChartIcon } from '../../shared/icons/ChartIcon'
import { ClockBGIcon } from '../../shared/icons/ClockBGIcon'
import { ExpensesIcon } from '../../shared/icons/ExpensesIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { FileIcon } from '../../shared/icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
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
    name: 'TimeLog',
    page: 'time-log',
    type: 'time-log',
    icon: <ClockBGIcon />,
  },
  {
    id: 7,
    name: 'Analytics',
    page: 'analytics',
    type: 'analytics',
    icon: <BookOpenIcon />,
  },
]
