import { FC } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Tab } from './Tab/Tab'
import styles from './Tabs.module.scss'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Current', send: 'recently' },
  { id: 1, name: 'All mine', send: 'my' },
  { id: 2, name: 'All', send: 'all' },
]

interface TabsProps {
  access: RolesAccess
  isActiveTab: string
  setIsActiveTab: (name: string) => void
}

export const Tabs: FC<TabsProps> = ({
  access,
  isActiveTab,
  setIsActiveTab,
}) => {
  const filteredTabs =
    access.all === 1
      ? tabsList
      : tabsList.filter(tab => tab.send === 'all')

  return (
    <div className={styles.wrapper}>
      {filteredTabs.map(item => {
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
