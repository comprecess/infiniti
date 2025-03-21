import { Tab } from './Tab/Tab'
import styles from './Tabs.module.scss'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Unpaid', send: 'Unpaid' },
  { id: 1, name: 'Partially Paid', send: 'Partially Paid' },
  { id: 2, name: 'Paid', send: 'Paid' },
  { id: 3, name: 'Cancelled', send: 'Cancelled' },
  { id: 4, name: 'All', send: '' },
]

interface TabsProps {
  isActiveTab: string
  setIsActiveTab: (name: string) => void
}

export const Tabs = ({ isActiveTab, setIsActiveTab }: TabsProps) => {
  return (
    <div className={styles.wrapper}>
      {tabsList.map(item => {
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
