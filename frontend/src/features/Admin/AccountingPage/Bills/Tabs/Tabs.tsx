import styles from './Tabs.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Tab } from '../../../Sales/InvoicesPage/Header/Tabs/Tab/Tab'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Summary', send: 'Summary' },
  { id: 1, name: 'All', send: 'All' },
  { id: 2, name: 'Add a Bill', send: 'Add a Bill' },
]

interface TabsProps {
  access: RolesAccess
  isActiveTab: string
  setIsActiveTab: (name: string) => void
}

export const Tabs = ({
  access,
  isActiveTab,
  setIsActiveTab,
}: TabsProps) => {
  const tabsToShow =
    access.create === 1 ? tabsList : tabsList.slice(0, tabsList.length - 1)

  return (
    <div className={styles.wrapper}>
      {tabsToShow.map(item => {
        return (
          <Tab
            key={item.id}
            title={item.name}
            send={item.send}
            isActive={item.send === isActiveTab}
            setIsActiveTab={setIsActiveTab}
          />
        )
      })}
    </div>
  )
}
