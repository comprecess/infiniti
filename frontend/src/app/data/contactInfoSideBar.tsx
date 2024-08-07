import { ActivityIcon } from '../../shared/icons/sidebarList/ActivityIcon'
import { DashboardIcon } from '../../shared/icons/sidebarList/DashboardIcon'
import { EditIcon } from '../../shared/icons/sidebarList/EditIcon'
import { EmailIcon } from '../../shared/icons/sidebarList/EmailIcon'
import { FileIcon } from '../../shared/icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../../shared/icons/sidebarList/InvoicesIcon'
import { LogIcon } from '../../shared/icons/sidebarList/LogIcon'
import { MoreIcon } from '../../shared/icons/sidebarList/MoreIcon'
import { OffersIcon } from '../../shared/icons/sidebarList/OffersIcon'
import { PasswordIcon } from '../../shared/icons/sidebarList/PasswordIcon'
import { TransactionsIcon } from '../../shared/icons/sidebarList/TransactionsIcon'

export const ContactInfoSideBarData = [
  {
    id: 0,
    name: 'Summary',
    page: 'summary',
    type: 'summary',
    icon: <DashboardIcon />,
  },
  {
    id: 1,
    name: 'Activity',
    page: 'activity',
    type: 'activity',
    icon: <ActivityIcon />,
  },
  {
    id: 2,
    name: 'Invoices',
    page: 'invoices',
    type: 'invoices',
    icon: <InvoicesIcon />,
  },
  {
    id: 3,
    name: 'Offers',
    page: 'offers',
    type: 'quotes',
    icon: <OffersIcon />,
  },
  {
    id: 4,
    name: 'Files',
    page: 'files',
    type: 'files',
    icon: <FileIcon />,
  },
  {
    id: 5,
    name: 'Transactions',
    page: 'transactions',
    type: 'transactions',
    icon: <TransactionsIcon />,
  },
  {
    id: 6,
    name: 'Email',
    page: 'email',
    type: 'email',
    icon: <EmailIcon />,
  },
  { id: 7, name: 'Log', page: 'log', type: 'log', icon: <LogIcon /> },
  {
    id: 8,
    name: 'Password Manager',
    page: 'passwordmanager',
    type: 'client-password-manager',
    icon: <PasswordIcon />,
  },
  { id: 9, name: 'Edit', page: 'edit', type: 'edit', icon: <EditIcon /> },
  { id: 10, name: 'More', page: 'more', type: 'more', icon: <MoreIcon /> },
]
